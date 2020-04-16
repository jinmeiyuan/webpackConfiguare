//开发环境主要实现的是热更新，不要压缩代码，完整的sourceMap
const Webpack = require("webpack")
const webpackConfig = require("./webpack.config.js")
const webpackMerge = require("webpack-merge")
module.exports = webpackMerge(webpackConfig,{
  mode:"development", //开发模式
  devtool:"cheap-module-eval-source-map",
  devServer:{
    port:8088,
    hot:true,
    contentBase:"../dist"
  },
  plugins:[
    new Webpack.HotModuleReplacementPlugin()
  ]
})