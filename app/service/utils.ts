import { Service } from 'egg';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LImage, LText, LShape, BootstrapComponent } from 'lego-bricks-react';
export default class UserService extends Service {
  async renderToPageData(query: { id: string, uuid: string }) {
    const work = await this.ctx.model.Work.findOne(query).lean();
    if (!work) {
      throw new Error('work not exist');
    }
    const { title, desc, content } = work;
    const reactEle = React.createElement('div', {
      className: 'final-page',
    }, content.components.map((component, index) => {
      return React.createElement(BootstrapComponent, {
        props: component.props,
        name: component.name,
        key: index,
      });
    }));
    const html = ReactDOMServer.renderToString(reactEle);
    return {
      html,
      title,
      desc,
    };
  }
}

