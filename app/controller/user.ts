import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';
const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};
const sendCodeRules = {
  phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' },
};
const userPhoneCreateRules = {
  phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' },
  veriCode: { type: 'string', format: /^\d{4}$/, message: '验证码格式错误' },
};

export default class UserController extends Controller {
  @inputValidate(userCreateRules, 'loginValidateFail')
  async createByEmail() {
    const { ctx, service } = this;
    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  @inputValidate(userCreateRules, 'loginValidateFail')
  async loginByEmail() {
    const { ctx, service, app } = this;
    // 根据 username 取得用户信息
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    // 检查用户是否存在
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    const verifyPwd = await ctx.compare(password, user.password);
    // 验证密码是否成功
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    const token = app.jwt.sign({ username: user.username, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }
  async show() {
    const { ctx, service } = this;
    const userData = await service.user.findByUsername(ctx.state.user.username);
    ctx.helper.success({ ctx, res: userData?.toJSON() });
  }

  @inputValidate(sendCodeRules, 'userValidateFail')
  async sendVeriCode() {
    const { ctx, app } = this;
    const { phoneNumber } = ctx.request.body;
    // 获取 redis 的数据
    // phoneVeriCode-1331111222
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    // 判断是否存在
    if (preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFrequentlyFailInfo' });
    }
    // [0 - 1)
    // [0 - 1) * 9000 = [0 - 9000)
    // [0 - 9000) + 1000 = [1000, 10000)
    const veriCode = (Math.floor(((Math.random() * 9000) + 1000))).toString();
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    ctx.helper.success({ ctx, res: { veriCode } });
  }

  @inputValidate(userPhoneCreateRules, 'userValidateFail')
  async loginByCellphone() {
    const { ctx, app } = this;
    const { phoneNumber, veriCode } = ctx.request.body;
    // 验证码是否正确
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (veriCode !== preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'loginVeriCodeIncorrectFailInfo' });
    }
    const token = await ctx.service.user.loginByCellphone(phoneNumber);
    ctx.helper.success({ ctx, res: { token } });
  }
}
