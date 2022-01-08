import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

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
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.mongoose = {
    client: {
      url: 'mongodb://1.116.156.44:27016/test',
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
    },
  };

  config.bcrypt = {
    saltRounds: 10,
  };

  config.jwt = {
    secret: '1234567890',
  };

  config.redis = {
    client: {
      port: 6378,
      host: '1.116.156.44',
      password: '',
      db: 0,
    },
  };
  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
