//让webpack只需要打包项目本身的文件代码，而不去编译第三方库，提高打包速度
const path = require("path")
const webpack = require("webpack")
module.exports = {
  //想要打包的模块的数组
  entry: {
    vendor: ['vue']
  },
  output: {
    path: path.resolve(__dirname, "static/js"),//打包后文件的位置
    filename: "[name].dll.js",
    library: '[name]_library'
  },
  plugins:[
    new webpack.DllPlugin({
      path:path.resolve(__dirname,'[name]-manifest.json'),
      name:'[name]_library',
      context:__dirname
    })
  ]
}