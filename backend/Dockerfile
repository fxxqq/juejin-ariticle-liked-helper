FROM node:latest as build-stage
RUN echo "-------------------- 后端express项目环境配置 --------------------"
RUN mkdir -p /juejin

WORKDIR /juejin/backend
RUN npm i --production

RUN tsc

EXPOSE 8001

CMD node dist/app