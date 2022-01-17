import indexDB from './indexDB'
import VueI18n from 'vue-i18n'
import axios from 'axios'

let languageName = 'zh'
let appName = 'srm'
let i18n = {}
// 切换语言方法
function internationlization(language) {
  languageName = language
  indexDB.openDatabase(appName).then(res => {
    indexDB.read(languageName, res).then(e => {
      console.log(res)
      if (e) {
        console.log('获取到了数据', e)
        battleVersion(e.version, res, e)
      } else {
        getNewDict(res, 'add')
      }
    })
  })
}
// 对比当前的版本是否是最新的
function battleVersion(version, _db, e) {
  axios.get(`/api/i18n/common/lang/version?group=${appName}&langCode=${languageName}`).then(res => {
    if (version === res.data.data) {
      changLanguage(e.dict)
    } else {
      // 从后端获取新的字典文件
      getNewDict(_db, 'put')
    }
  })
}
// 从后端获取新的字典文件
function getNewDict(_db, type) {
  axios
    .get(`/api/i18n/common/lang/groupDict?group=${appName}&langCode=${languageName}`)
    .then(res => {
      if (type === 'add') {
        indexDB.add(
          { language: languageName, version: res.data.data.version, dict: res.data.data.dict },
          _db
        )
      } else {
        indexDB.put(
          { language: languageName, version: res.data.data.version, dict: res.data.data.dict },
          _db
        )
      }

      changLanguage(res.data.data.dict)
    })
}
// 切换语言
function changLanguage(dict) {
  i18n.setLocaleMessage(languageName, dict)
  i18n.locale = languageName
  // localStorage.setItem(`internationlization-${appName}`, JSON.stringify({ langCode: languageName }))
}
// 引入i18n
function digisI18n(Vue, app) {
  appName = app
  Vue.use(VueI18n)
  i18n = new VueI18n({
    locale: 'zh-CN',
    messages: {
      'zh-CN': { common: { 登录: '登录' } }
    }
  })
  // creatFunc()
  layoutCreatLanguage()
  return i18n
}
// 初始化，恢复到上次选择的语言
// function creatFunc() {
//   setTimeout(() => {
//     if (localStorage.getItem(`internationlization-${appName}`)) {
//       const lanData = JSON.parse(localStorage.getItem(`internationlization-${appName}`))
//       internationlization(lanData.langCode)
//     } else {
//       localStorage.setItem(`internationlization-${appName}`, JSON.stringify({ langCode: 'zh' }))
//       internationlization('zh')
//     }
//   }, 10)
// }
function layoutCreatLanguage() {
  if (localStorage.getItem('internationlization')) {
    internationlization(localStorage.getItem('internationlization'))
  } else {
    internationlization(languageName)
  }
}
export default {
  internationlization: internationlization,
  digisI18n: digisI18n,
  changLanguage: changLanguage,
  layoutCreatLanguage: layoutCreatLanguage
}
