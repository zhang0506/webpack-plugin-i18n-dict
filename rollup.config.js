const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const path = require('path')
const cleaner = require('rollup-plugin-cleaner')
const pkg = require(path.join(process.cwd(), 'package.json'))
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const { terser } = require('rollup-plugin-terser')
const scss = require('rollup-plugin-scss')
const VuePlugin = require('rollup-plugin-vue')
const typescript = require('rollup-plugin-typescript2')
const image = require('@rollup/plugin-image')
const fs = require('fs')

const tsInputExists = fs.existsSync('src/index.ts')

const input = tsInputExists ? 'src/index.ts' : 'src/index.js'
const isProduction = process.env.NODE_ENV === 'production'

const moduleRegExp = module => new RegExp(`^${module}(\\/.+)*$`)

function getModulesMatcher(modulesNames) {
  const regexps = modulesNames.map(moduleRegExp)
  return id => regexps.some(regexp => regexp.test(id))
}

function isBareModuleId() {
  const dependenciesNames = Object.keys(pkg.dependencies || {})
  const peerDependenciesNames = Object.keys(pkg.peerDependencies || {})

  return getModulesMatcher([...dependenciesNames, ...peerDependenciesNames])
}

function getPlugins(format) {
  const vueOptions = {
    css: false,
    needMap: false,
    style: {
      preprocessOptions: {
        scss: {
          includePaths: [path.resolve(process.cwd(), './node_modules/@syncfusion')]
        }
      }
    }
  }

  const tsPugins = tsInputExists
    ? typescript({ tsconfigOverride: { include: ['src/**/*'] }, useTsconfigDeclarationDir: true })
    : null

  let plugins = [
    globals(),
    image(),
    builtins(),
    resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'] }),
    commonjs({ exclude: 'src/**' }),
    tsPugins,
    scss({
      output: `build/${format}/bundle.css`,
      includePaths: [path.resolve(process.cwd(), './node_modules/@syncfusion')]
    }),
    VuePlugin(vueOptions),
    babel({
      babelrc: false,
      exclude: /node_modules/,
      runtimeHelpers: true,
      sourceMaps: false,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      presets: ['@babel/preset-env', '@babel/typescript', '@vue/babel-preset-jsx'],
      plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        ['@babel/plugin-transform-runtime', { corejs: 3, useESModules: format === 'esm' }],
        ['@babel/proposal-decorators', { legacy: true }],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread'
      ]
    }),
    replace({ 'process.env.BUILD_FORMAT': JSON.stringify(format) })
  ]

  plugins = plugins.filter(item => item !== null)

  if (isProduction) {
    plugins.unshift(
      cleaner({
        targets: [`./build/${format}`]
      })
    )
    plugins.push(terser())
  }

  return plugins
}

const cjs = [
  {
    input,
    output: { dir: 'build/cjs', sourcemap: true, format: 'cjs' },
    external: isBareModuleId(),
    plugins: getPlugins('cjs')
  }
]

const esm = [
  {
    input,
    output: { dir: 'build/esm', sourcemap: true, format: 'esm' },
    external: isBareModuleId(),
    plugins: getPlugins('esm')
  }
]

let config
switch (process.env.BUILD_ENV) {
  case 'cjs':
    config = cjs
    break
  case 'esm':
    config = esm
    break
  default:
    config = cjs.concat(esm)
}

module.exports = config
