FROM node:8.9.4-alpine
RUN echo "-------------------- 后端express项目环境配置 --------------------"

WORKDIR /juejin/helper/backend
RUN rm -f package-lock.json \
  ; rm -rf .idea \
  ; rm -rf node_modules \
  ; npm config set registry "https://registry.npm.taobao.org/" \
  && npm i --production

RUN npm run build

EXPOSE 8001

CMD node dist/app