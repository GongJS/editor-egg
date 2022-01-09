import { Controller } from 'egg';
import * as sendToWormhole from 'stream-wormhole';
import { nanoid } from 'nanoid';
import { join, extname } from 'path';
import { FileStream } from '../../typings/app';

export default class UtilsController extends Controller {
  splitIdAndUuid(str = '') {
    const result = { id: '', uuid: '' };
    if (!str) return result;
    const firstDashIndex = str.indexOf('-');
    if (firstDashIndex < 0) return result;
    result.id = str.slice(0, firstDashIndex);
    result.uuid = str.slice(firstDashIndex + 1);
    return result;
  }
  async renderH5Page() {
    // id-uuid split('-')
    // uuid = aa-bb-cc
    const { ctx } = this;
    const { idAndUuid } = ctx.params;
    const query = this.splitIdAndUuid(idAndUuid);
    try {
      const pageData = await this.service.utils.renderToPageData(query);
      console.log(9999, pageData)
      await ctx.render('page.nj', pageData);
    } catch (e) {
      console.log(5555, e)
      ctx.helper.error({ ctx, errorType: 'h5WorkNotExistError' });
    }
  }
  // 单文件
  async uploadToOSS() {
    const { ctx, app } = this;
    const stream = await ctx.getFileStream();
    const savedOSSPath = join('test', nanoid(6) + extname(stream.filename));
    try {
      const result = await ctx.oss.put(savedOSSPath, stream);
      app.logger.info(result);
      const { name, url } = result;
      ctx.helper.success({ ctx, res: { name, url } });
    } catch (e) {
      await sendToWormhole(stream);
      ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
    }
  }
  // 多文件
  async uploadMutipleFiles() {
    const { ctx, app } = this;
    const { fileSize } = app.config.multipart;
    const parts = ctx.multipart({ limits: { fileSize: fileSize as number } });
    // { urls: [xxx, xxx ]}
    const urls: string[] = [];
    let part: FileStream | string[];
    while ((part = await parts())) {
      if (Array.isArray(part)) {
        app.logger.info(part);
      } else {
        try {
          const savedOSSPath = join('test', nanoid(6) + extname(part.filename));
          const result = await ctx.oss.put(savedOSSPath, part);
          const { url } = result;
          urls.push(url);
          if (part.truncated) {
            await ctx.oss.delete(savedOSSPath);
            return ctx.helper.error({ ctx, errorType: 'imageUploadFileSizeError', error: `Reach fileSize limit ${fileSize} bytes` });
          }
        } catch (e) {
          await sendToWormhole(part);
          ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
        }
      }
    }
    ctx.helper.success({ ctx, res: { urls } });
  }
}
