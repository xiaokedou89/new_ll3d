"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    // 打包优化开启分离node_modules模式
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api3": {
        target: "https://www.ll3d.com",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          ["^/api3"]: ""
        }
      },
      /*
      "/api2": {
        // target: "http://192.168.1.104:7530",
        // target: "http://192.168.1.126:8082",
        target: "http://192.168.1.104:8090",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          ["^/api2"]: ""
        }
      },
      */
      "/file-api": {
        // target: "http://192.168.1.104:8090",
        target: "http://192.168.1.119:8082",
        // target: "http://192.168.1.126:8082",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          ["^/file-api"]: ""
        }
      },
      /*
      "/api1": {

        // target: "http://192.168.1.126:8089",
        target: "http://192.168.1.104:8089",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          ["^/api1"]: ""
        }
      },
      */
      "/web-api": {
        // target: "http://192.168.1.104:8089",
        target: "http://192.168.1.119:8089",
        // target: "http://192.168.1.126:8089",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          ["^/web-api"]: ""
        }
      }
    }
  }
};
