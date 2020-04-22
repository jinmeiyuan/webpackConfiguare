const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
// let indexLess = new ExtractTextWebpackPlugin("index.less")
// let indexCss = new ExtractTextWebpackPlugin("index.css")
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const devMode = process.argv.indexOf("--mode=production") === -1
const HappyPack = require("happypack")
const os = require("os")
const HappyThreadPool = HappyPack.ThreadPool({size:os.cpus().length})
const CopyWebpackPlugin = require("copy-webpack-plugin")
const Webpack = require("webpack")
module.exports = {
  entry:["@babel/polyfill",path.resolve(__dirname,"../src/main.js")],
  // {
  //   main:path.resolve(__dirname,"../src/main.js"), //入口文件
  //   header:path.resolve(__dirname,"../src/header.js")
  // },
  output:{
    filename:"[name].[hash:8].js",//打包后的文件名称
    path:path.resolve(__dirname,"../dist")//打包后的目录
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        // use:['style-loader','css-loader']
        // indexCss.extract({
        //   use:['css-loader','postcss-loader']
        // })
        use:[{
          loader:devMode?'vue-style-loader':MiniCssExtractPlugin.loader,
          options:{
            publicPath:"../dist/css",
            hmr:devMode
          }
        },'css-loader','postcss-loader']
        // use:[MiniCssExtractPlugin.loader,'css-loader'] //从右向左解析原则
      },
      {
        test:/\.less$/,
        use:[{
          loader:devMode?'vue-style-loader':MiniCssExtractPlugin.loader,
          options:{
            publicPath:"../dist/css",
            hmr:devMode
          }
        },'css-loader','less-loader','postcss-loader']
        // use:['style-loader','css-loader','postcss-loader','less-loader']
        // indexLess.extract({
        //   use:['css-loader','postcss-loader','less-loader']
        // })
        // use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader']
      },
      {
        test:/\.(jpe?g|png|gif)$/i,//图片文件,
        use:[
          {
            loader:"url-loader",
            options:{
              limit:10240,
              fallback:{
                loader:"file-loader",
                options:{
                  name:'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test:/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use:[{
          loader:"url-loader",
          options:{
            limit:10240,
            fallback:{
              loader:'file-loader',
              options:{
                name:'media/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test:/\.js$/,
        use:[{
          loader:"happypack/loader?id=happyBabel"
        }],
        // use:{
        //   loader:"babel-loader",
        //   options:{
        //     presets:['@babel/preset-env']
        //   },
        // },
        exclude:/node_modules/
      },
      {
        test:/\.vue$/,
        use:[{
          loader:'vue-loader',
          options:{
            compilerOptions:{
              preserveWhitespace:false
            }
          }
        }]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,"../public/index.html"),
      filename:"index.html",
      chunks:['main'] //与入口文件对应的模块名
    }),
    // new HtmlWebpackPlugin({
    //   template:path.resolve(__dirname,"../public/header.html"),
    //   filename:"header.html",
    //   chunks:['header']
    // }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename:devMode?'[name].css':"[name].[hash].css",
      chunkFilename:devMode?'[id].css':"[id].[hash].css"
    }),
    // indexLess,
    // indexCss
    new vueLoaderPlugin(),
    new HappyPack({
      id:"happyBabel",
      loaders:[
        {
          loader:"babel-loader",
          options:{
            presets:[
              ['@babel/preset-env']
            ],
            cacheDirectory:true
          }
        }
      ],
      threadPool:HappyThreadPool
    }),
    new Webpack.DllReferencePlugin({
      context:__dirname,
      manifest:require("./vendor-manifest.json")
    }),
    new CopyWebpackPlugin([{
      from:"static",to:"static"
    }])
  ],
  resolve:{
    alias:{
      'vue$':"vue/dist/vue.runtime.esm.js",
      "@":path.resolve(__dirname,"../src")
    },
    extensions:["*",".js",'.json','.vue']//在导入没带后缀时，webpack会自动带上后缀去尝试访问文件是否存在
  }
}