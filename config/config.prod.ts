import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.mongoose = {
    url: process.env.MONGOOSE_URL!,
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
    },
  };
  config.redis = {
    client: {
      port: 6379,
      host: 'docker-host',
      password: process.env.REDIS_PASSWORD,
    },
  };
  config.H5BaseURL = 'https://editor-server.ooaaoo.top/api/pages';
  config.jwtExpires = '2 days';
  return config;
};
