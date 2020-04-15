
import express from 'express';
import { NextFunction, Request, Response } from 'express'; // express申明文件定义的类型

import { systemConfig } from './config';


import * as listController from "./controllers/list";
const app: express.Application = express();

app.get('/api/getList/:userId', listController.getLikeList)
// app.get('/api/getArtcileContent/:id', listController.getArtcileContent)

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  return res.sendStatus(500);
});

app.listen(systemConfig.port, function () {
  console.log(`the server is start at port ${systemConfig.port}`);
});

export default app;
