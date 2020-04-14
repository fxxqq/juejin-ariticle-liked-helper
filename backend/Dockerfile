FROM node:latest as build-stage
RUN echo "-------------------- 后端express项目环境配置 --------------------"
RUN mkdir -p /usr/src/juejin

WORKDIR /usr/src/juejin

COPY ./backend /usr/src/juejin/

RUN npm i --production

RUN tsc

EXPOSE 8001

CMD node dist/app