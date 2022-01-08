// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUser from '../../../app/controller/user';
import ExportWork from '../../../app/controller/work';

declare module 'egg' {
  interface IController {
    user: ExportUser;
    work: ExportWork;
  }
}
