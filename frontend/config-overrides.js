const { override, fixBabelImports, addWebpackPlugin } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
if (process.env.NODE_ENV === 'production') process.env.GENERATE_SOURCEMAP = "false"
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackPlugin(new AntdDayjsWebpackPlugin())
);