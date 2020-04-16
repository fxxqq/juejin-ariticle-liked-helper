FROM node:8.9.4-alpine
RUN echo "-------------------- 后端express项目环境配置 --------------------"

WORKDIR /backend
RUN npm i --production

RUN npm run build

EXPOSE 8001

CMD node dist/app