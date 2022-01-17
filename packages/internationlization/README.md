# @digis/internationalization

### 功能：
接入国际化功能
### 引入：
```js
import Vue from "vue";
import indexDB from "@digis/internationalization";
const i18n = indexDB.digisI18n(Vue,'srm')//第二个参数是当前使用的应用code
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

// 在写代码的时候，需要国际化的字段改成用$t("")包裹；
// 比如：<span>登录</span> =><span>$t("登录")</span>
// 微应用接入只需引入即可
```
### 切换语言
```js
import indexDB from "@digis/internationalization";

indexDB.internationlization('en')//所要切换的语言code，会从接口中获取
```
@digis/internationalization
