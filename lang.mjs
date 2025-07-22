import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import ora from 'ora'

const DIR = './src/dictionaries'

const getData = (obj, lang) => {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj[lang]) {
    return obj[lang]
  }
  const newObj = {}
  Object.keys(obj).forEach(key => {
    newObj[key] = getData(obj[key], lang)
  })
  return newObj
}
async function sleep (t) {
  return new Promise(resolve => {
    setTimeout(() => {
      return resolve()
    }, t * 1000)
  })
}

const main = async () => {
  try {
    spinner.start('start create language files')

    const files = fs.readdirSync(path.join(DIR, 'modules'))
    files.forEach(file => {
      const jsFileName = file.split('.')[0] + '.json'
      // 获取yaml内容
      const yamlContent = fs.readFileSync(path.join(DIR, 'modules', file), 'utf8')
      //  使用 js-yaml 将yaml转换为json数据
      const json = yaml.load(yamlContent)
      const cn = getData(json, 'cn')
      const en = getData(json, 'en')

      // 创建目录
      const cnDir = path.join(DIR, 'cn')
      if (!fs.existsSync(cnDir)) {
        fs.mkdirSync(cnDir)
      }
      const enDir = path.join(DIR, 'en')
      if (!fs.existsSync(enDir)) {
        fs.mkdirSync(enDir)
      }

      // 保存js文件
      fs.writeFileSync(path.join(DIR, 'cn', jsFileName), `${JSON.stringify(cn)}`)
      fs.writeFileSync(path.join(DIR, 'en', jsFileName), `${JSON.stringify(en)}`)
      spinner.info(`creating ${jsFileName}`)
    })
    await sleep(1)
    spinner.succeed('create language files success')
  } catch (e) {
    console.log('err', e)
    spinner.fail('error:' + e)
  }
}

const spinner = ora({})
main()
