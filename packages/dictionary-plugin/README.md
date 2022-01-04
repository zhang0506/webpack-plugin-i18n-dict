# @sanliang/dictionary-plugin

### 功能：
获取项目中所有使用i18n国际化字段的Key，并且在dist目录下生成dictData.json文件

### 使用：
vue.config.js
```js
const DictionaryPlugin = require("@sanliang/dictionary-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new DictionaryPlugin() // new DictionaryPlugin({NODE_ENV:'production'}) 执行的插件的环境 默认为'production'
    ]
};
```
执行npm run build
