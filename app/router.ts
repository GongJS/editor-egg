import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const jwtMiddleware = app.jwt as any;
  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/getUserInfo', jwtMiddleware, controller.user.show);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/genVeriCode', controller.user.sendVeriCode);
  router.post('/api/users/loginByPhoneNumber', controller.user.loginByCellphone);

  router.post('/api/works', jwtMiddleware, controller.work.createWork);
};
