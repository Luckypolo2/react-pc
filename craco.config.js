/*
* craco 第三方管理webpack配置
* */
const path = require('path')

module.exports = {
  webpack: {
    // 配置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
}
