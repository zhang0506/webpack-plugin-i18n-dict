const fs = require('fs')
const path = require('path')
let file = ''
let NODE_ENV = 'production'

class DictionaryPlugin {
  constructor(callBack) {
    // 存下在构造函数中传入的回调函数
    if (callBack) { NODE_ENV = callBack.NODE_ENV || 'production' }
  }

  apply(compiler) {
    compiler.plugin('done', stats => {
      // 在 done 事件中回调 doneCallback
      const filePath = path.join(compiler.outputPath, 'js')
      file = path.join(compiler.outputPath, 'dictData.json')
      if (process.env.NODE_ENV === NODE_ENV) {
        fileDisplay(filePath)
      }
    })
    compiler.plugin('failed', err => {
      console.warn(err)
    })
  }
}
/**
 * 读取原有文件方法
 * @param arr 需要写入的内容
 */
function createFile(arr) {
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
      } else {
        writeF(`${data}<splitMark>${arr}`)
      }
    })
  } else {
    writeF(arr)
  }
}
/**
 * 文件写入方法
 * @param data 需要写入的内容
 */
function writeF(data) {
  const jsonData = [...new Set(data.split('<splitMark>'))].join('<splitMark>')
  // 写入文件
  fs.writeFile(file, jsonData, (err) => {
    if (err) {
      return console.log(err)
    }
    // console.log(`字典文件地址:${file},以'<splitMark>'隔开`)
  })
}
/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (err, files) => {
    if (err) {
      // console.warn('请使用build打包同步生成字典文件')
    } else {
      // 遍历读取到的文件列表
      files.forEach((filename) => {
        // 获取当前文件的绝对路径
        const filedir = path.join(filePath, filename)
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, (eror, stats) => {
          if (eror) {
            console.warn('获取文件stats失败')
          } else {
            const isFile = stats.isFile() // 是文件
            const isDir = stats.isDirectory() // 是文件夹
            if (isFile) {
              // console.log(filedir)
              const dictKey = fs
                .readFileSync(filedir, 'utf8')
                .match(/(?<=\$t\(("|'))(.*?)(?=("|')\))/g)
              if (dictKey != null) createFile(dictKey.join('<splitMark>'))
            }
            if (isDir) {
              fileDisplay(filedir) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}
// 导出插件
module.exports = DictionaryPlugin
