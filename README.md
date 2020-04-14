
### Github + Jenkins + Docker 实现自动化部署
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