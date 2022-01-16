import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.mongoose = {
    url: 'mongodb://lego-mongo:27017/lego',
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
    },
  };
  config.redis = {
    client: {
      port: 6379,
      host: 'lego-redis',
      password: process.env.REDIS_PASSWORD,
    },
  };
  config.security = {
    domainWhiteList: [ 'http://1.116.156.44' ],
  };
  config.H5BaseURL = 'http://1.116.156.44/api/pages';
  config.jwtExpires = '2 days';
  return config;
};
