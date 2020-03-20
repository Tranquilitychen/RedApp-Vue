module.exports = {
  devServer: {
    proxy: {
      "/api": {
        // 此处的写法，目的是为了 将 /api 替换成 http://localhost:8000/
        target: "http://localhost:8000/",
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
