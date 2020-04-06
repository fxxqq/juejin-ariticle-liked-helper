##### 快速构建一个express+tyepScript项目
```
npm init -y
npm install -g typescript
npm install -g tslint
npm install --save express // 安装普通 express 模块，并在 dependencies 下生成包记录
npm install --save-dev @types/express // 安装带有声明文件的 express 模块，并在 devDependencies 下生成包记录，仅开发模式下安装。
```