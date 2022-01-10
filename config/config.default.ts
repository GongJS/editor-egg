import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as dovenv from 'dotenv';
dovenv.config();
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1641187381969_1415';

  // add your egg config in here
  config.middleware = [ 'customError' ];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    H5BaseURL: 'http://localhost:7001/api/pages',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.mongoose = {
    client: {
      url: process.env.MONGOOSE_URL!,
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
    },
  };

  config.bcrypt = {
    saltRounds: 10,
  };

  config.jwt = {
    enable: true,
    secret: process.env.JWT_SECRET,
    match: [ '/api/users/getUserInfo', '/api/works', '/api/utils/upload-img', '/api/channel' ],
  };

  config.redis = {
    client: {
      port: parseInt(process.env.REDIS_PORT!, 10),
      host: process.env.REDIS_HOST,
      password: '',
      db: 0,
    },
  };
  config.oss = {
    client: {
      accessKeyId: process.env.ALC_ACCESS_ID,
      accessKeySecret: process.env.ALC_ACCESS_SECRET,
      bucket: 'gjs-lego',
      endpoint: 'oss-cn-shanghai.aliyuncs.com',
    },
  };
  config.multipart = {
    whitelist: [ '.png', '.jpg', '.gif', '.webp' ],
    fileSize: '1mb',
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
  };
  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
