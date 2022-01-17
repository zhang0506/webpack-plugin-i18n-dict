let db = null
let appName = ''
// 初始化数据库
function openDatabase(app) {
  appName = app
  var request = window.indexedDB.open(`digis-${appName}`)
  return new Promise((resolve, reject) => {
    request.addEventListener('success', e => {
      console.log('连接数据库成功')
      db = e.target.result
      resolve(db)
    })
    request.addEventListener('upgradeneeded', e => {
      console.log('版本号变了')
      db = e.target.result
      db.createObjectStore(appName, {
        keyPath: 'language',
        autoIncrement: false
      })
      resolve(db)
    })
  })
}
function add(data, _db) {
  var request = _db.transaction(appName, 'readwrite')
  var store = request.objectStore(appName)
  const reqAdd = store.add(data)
  return new Promise((resolve, reject) => {
    reqAdd.onsuccess = function(event) {
      console.log('数据写入成功')
      resolve(event)
    }
    reqAdd.onerror = function(event) {
      console.log('数据写入失败')
      reject(event)
    }
  })
}
function read(lang, _db) {
  var transaction = _db.transaction(appName)
  var objectStore = transaction.objectStore(appName)
  // 用户读取数据，参数是主键
  var request = objectStore.get(lang)
  return new Promise((resolve, reject) => {
    request.onerror = function(event) {
      console.log('事务失败')
      reject(event)
    }
    request.onsuccess = function(event) {
      resolve(request.result)
    }
  })
}
function put(data, _db) {
  var request = _db.transaction(appName, 'readwrite')
  var store = request.objectStore(appName)
  const reqPut = store.put(data)

  reqPut.onsuccess = function(event) {
    console.log('数据更新成功')
  }

  reqPut.onerror = function(event) {
    console.log('数据更新失败')
  }
}
function remove(data) {
  var request = db.transaction(appName, 'readwrite')
  var store = request.objectStore(appName)
  const reqRemove = store.delete(data)
  reqRemove.onsuccess = function(event) {
    console.log('数据删除成功')
  }
}
export default {
  openDatabase: openDatabase,
  add: add,
  put: put,
  remove: remove,
  read: read
}
