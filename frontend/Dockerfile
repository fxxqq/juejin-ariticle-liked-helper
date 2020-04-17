# node镜像
FROM node:8.9.4-alpine

RUN echo "-------------------- 前端react项目环境配置 --------------------"

# 指定接下来的工作路径为/usr/src/juejin - 类似于cd命令
WORKDIR /backend

# 设置淘宝npm镜像
RUN npm i -g cnpm --registry=https://registry.npm.taobao.org
# 安装依赖
RUN cnpm i --production

# 打包 - 目的：丢到nginx下跑
RUN cnpm run build

# 前端项目运行命令
#CMD ["npm","run","start"]

# 拷贝前端vue项目打包后生成的文件到nginx目录下
COPY  /backend/build /58fe/juejin-helper

# 使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx", "-g", "daemon off;"]
# 注：CMD不同于RUN，CMD用于指定在容器启动时所要执行的命令，而RUN用于指定镜像构建时所要执行的命令。
#    RUN指令创建的中间镜像会被缓存，并会在下次构建中使用。如果不想使用这些缓存镜像，可以在构建时指定--no-cache参数，如：docker build --no-cache
