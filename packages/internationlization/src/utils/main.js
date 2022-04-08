import indexDB from './indexDB'
import VueI18n from 'vue-i18n'
import axios from 'axios'

let languageName = 'zh'
let appName = 'srm'
let i18n = {}
// 切换语言方法
function internationlization(language) {
  languageName = language
  localStorage.setItem('internationlization', languageName)
  return new Promise((resolve, reject) => {
    indexDB.openDatabase(appName).then(res => {
      indexDB.read(languageName, res).then(e => {
        if (e) {
          console.log('获取到了数据', e)
          battleVersion(e.version, res, e).then(() => {
            resolve()
          }).catch((err) => {
            reject(err)
          })
        } else {
          getNewDict(res, 'add').then(() => {
            resolve()
          }).catch((err) => {
            reject(err)
          })
        }
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}
// 对比当前的版本是否是最新的
function battleVersion(version, _db, e) {
  return new Promise((resolve, reject) => {
    axios.get(`/i18n/common/lang/version?group=${appName}&langCode=${languageName}`).then(res => {
      if (version === res.data) {
        changLanguage(e.dict)
        resolve()
      } else {
        // 从后端获取新的字典文件
        getNewDict(_db, 'put').then(() => {
          resolve()
        })
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
// 从后端获取新的字典文件
function getNewDict(_db, type) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/i18n/common/lang/groupDict?group=${appName}&langCode=${languageName}`)
      .then(res => {
        if (type === 'add') {
          indexDB.add(
            { language: languageName, version: res.data.version, dict: res.data.dict },
            _db
          )
        } else {
          indexDB.put(
            { language: languageName, version: res.data.version, dict: res.data.dict },
            _db
          )
        }
        changLanguage(res.data.dict)
        resolve()
      }).catch((err) => {
        reject(err)
      })
  })
}
// 切换语言
function changLanguage(dict) {
  i18n.setLocaleMessage(languageName, dict)
  i18n.locale = languageName
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
  // layoutCreatLanguage()
  return i18n
}
// 初始化，恢复到上次选择的语言
function layoutCreatLanguage() {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem('internationlization')) {
      internationlization(localStorage.getItem('internationlization')).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    } else {
      internationlization(languageName).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    }
  })
}
function getLanguage() {
  return localStorage.getItem('internationlization') || 'zh'
}
export default {
  internationlization: internationlization,
  digisI18n: digisI18n,
  changLanguage: changLanguage,
  layoutCreatLanguage: layoutCreatLanguage,
  getLanguage: getLanguage
}
