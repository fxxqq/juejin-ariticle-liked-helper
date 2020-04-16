![操作引导](https://cdn.58fe.com/juejin/juejin.gif)

### 后端Express项目
**安装Express**
```
npm install -g typescript
npm install -g tslint
npm install --save express // 安装普通 express 模块，并在 dependencies 下生成包记录
npm install --save-dev @types/express // 安装带有声明文件的 express 模块，并在 devDependencies 下生成包记录，仅开发模式下安装。
```
**目录结构**
```js
 ├──backend
       ├──dist
       ├──src
          ├──app
          ├──controllers
       └──tsconfig.json
```
**app.ts**
```ts
import express from 'express';
import { NextFunction, Request, Response } from 'express'; // express申明文件定义的类型

import * as listController from "./controllers/list";
const app: express.Application = express();

app.get('/api/getList/:userId', listController.getLikeList)

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  return res.sendStatus(500);
});

app.listen(8001, function () {
  console.log(`the server is start at port 8001`);
});

export default app;
```

开发node+typescript项目时，可以使用ts-node来调试代码，使用tsc编译代码
```json
"scripts": {
    "dev": "nodemon --watch 'src/' -e ts --exec 'ts-node' ./src/app.ts",
    "build": "tsc"
  }
```
**用superagent爬取数据**
[superagent](https://cnodejs.org/topic/5378720ed6e2d16149fa16bd) 是 Node.js 里面一个蛮方便的客户端请求代理模块，用来打请求非常方便。
```ts
const request = require("superagent");
export const getLikeList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let result: any = [];
  let { userId } = req.params;
  let url = `https://user-like-wrapper-ms.juejin.im/v1/user/${userId}/like/entry`;
  request
    .get(`${url}?page=0&pageSize=${pageSize}`)
    .set("X-Juejin-Src", "web")
    .end((err, res) => {
      if (err) {
        return console.log(err);
      }

      let entryList = res.body.d.entryList;
      const total = res.body.d.total;
      let pages = Math.ceil(total / pageSize);
      entryList = handleResult(entryList);

      let promiseList: any[] = [];
      for (let i = 1; i <= pages; i++) {
        promiseList.push(
          new Promise((resolve, reject) => {
            request
              .get(`${url}?page=${i}&pageSize=${pageSize}`)
              .set("X-Juejin-Src", "web")
              .end((err, res) => {
                if (err) {
                  return console.log(err);
                }
                let entryList2 = JSON.parse(res.text).d.entryList;
                entryList2 = handleResult(entryList2);
                resolve(entryList2);
              });
          })
        );
      }

      Promise.all(promiseList).then((rspList: any) => {
        result = [...entryList, ...flatten(rspList)];
      });
    });
};
```

### 前端项目
一、 使用 create-react-app 一步步地创建一个 TypeScript 项目，并引入 antd。

```
npx create-react-app frontend --template typescript
cd frontend
```
二、使用 customize-cra 修改React 脚手架配置实践
安装 react-app-rewired ,[customize-cra](https://github.com/arackaf/customize-cra)，它提供一些修改 React 脚手架默认配置函数 
```
npm i react-app-rewired customize-cra --save-dev
```

安装后，修改 package.json 文件的 scripts
```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
}
```

项目根目录创建一个 `config-overrides.js` 用于修改Webpack 配置。

`antd-dayjs-webpack-plugin`是Ant Design 官方推荐的插件，用于替换`moment.js`，你可以使用 antd-dayjs-webpack-plugin 插件用 Day.js 替换 momentjs 来大幅减小打包大小。
| Name      | Size     | Size gzip |
|-----------|----------|-----------|
| Day.js    | 11.11 kb | 4.19 kb   |
| Moment.js | 231 kb   | 65.55 kb  |

Ant Design 提供了一个按需加载的 babel 插件 `babel-plugin-import`

安装 `npm i babel-plugin-import --save-dev,`并修改`config-overrides.js` 配置文件
```js
const { override, fixBabelImports，addWebpackPlugin } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
//override函数用来覆盖React脚手架Webpack配置；fixBabelImports修改babel配置
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
 }),
   addWebpackPlugin(new AntdDayjsWebpackPlugin())
);
```
### Github + Jenkins + Docker 实现自动化部署

docker-compose来部署前端react项目到Nginx中，和运行后端express项目

1. 安装 Docker 并启动 Docker
```
// 更新软件库
yum update -y

// 安装 docker
yum install docker -y

// 启动 docker 服务
service docker start

// 重启docker 服务
service docker restart

// 停止 docker 服务
service docker stop
```

2. 安装 Docker-Compose 编排容器执行顺序，相对于一个一个docker run方式运行项目更方便

// 下载并安装 docker-compose (\可以根据实际情况修改最新版本)
```
curl -L https://github.com/docker/compose/releases/download/1.24.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

// 设置权限
chmod +x /usr/local/bin/docker-compose

// 安装完查看版本
docker-compose -version
```


[Github + Jenkins + Docker 实现自动化部署](https://github.com/mcuking/blog/issues/61)
[docker-compose 部署 Vue+SpringBoot 前后端分离项目](https://segmentfault.com/a/1190000021008496)