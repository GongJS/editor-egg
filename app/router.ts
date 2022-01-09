import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.prefix('/api');
  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/getUserInfo', controller.user.show);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/genVeriCode', controller.user.sendVeriCode);
  router.post('/users/loginByPhoneNumber', controller.user.loginByCellphone);

  router.post('/works', controller.work.createWork);
  router.get('/works', controller.work.myList);
  router.get('/templates', controller.work.templateList);
  router.patch('/works/:id', controller.work.update);
  router.delete('/works/:id', controller.work.delete);
  router.post('/works/publish/:id', controller.work.publishWork);
  router.post('/works/publish-template/:id', controller.work.publishTemplate);

  router.post('/utils/upload', controller.utils.uploadToOSS);
  router.post('/utils/upload-img', controller.utils.uploadMutipleFiles);
  router.get('/pages/:idAndUuid', controller.utils.renderH5Page);
};
