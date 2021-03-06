import { Service } from 'egg';
import { UserProps } from '../model/user';
export default class UserService extends Service {
  public async createByEmail(payload: UserProps) {
    const { ctx } = this;
    const { username, password } = payload;
    const hash = await ctx.genHash(password);
    const userCreatedData: Partial<UserProps> = {
      username,
      password: hash,
      email: username,
    };
    return ctx.model.User.create(userCreatedData);
  }
  async findById(id: string) {
    return this.ctx.model.User.findById(id);
  }
  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({ username });
  }
  async loginByCellphone(cellphone: string) {
    const { ctx, app } = this;
    const user = await this.findByUsername(cellphone);
    // 检查 user 记录是否存在
    if (user) {
      // generate token
      const token = app.jwt.sign({ username: user.username, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
      return token;
    }
    // 新建一个用户
    const userCreatedData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `乐高${cellphone.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
    return token;
  }
}
