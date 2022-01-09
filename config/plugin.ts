import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  bcrypt: {
    enable: true,
    package: 'egg-bcrypt',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  oss: {
    enable: true,
    package: 'egg-oss',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  },
};

export default plugin;
