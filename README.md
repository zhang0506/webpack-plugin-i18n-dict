[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

### 第一次使用：

```bash
npm install
npm install --global lerna
lerna bootstrap
```

lerna 包管理下的主包

### 开发规范：

1. 各个子包统一在 packages 目录下。
2. 所有未经测试通过的不允许发布，要保证发布版本的稳定性，版本号方面 lerna 会去帮你管理，只要选择对应的 major、minor、patch 版本就好了。
3. 请认真写好各个 packages 下的 README。
4. CHANGELOG 是根据提交信息自动生成的，所以严格规范了提交信息，如下使用（请规范选择 type,会影响到生成的 CHANGELOG 以及版本号）：

```shell
<type>(<scope>): <subject>
```

示例：

```bash
feat(多租户): 新增设备管理模块
```

type 类型如下：

```shell
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
```

详情可以参考[这里](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

### 开发方式：

#### 安装：[lerna bootstrap](https://github.com/lerna/lerna/tree/master/commands/bootstrap#readme)

#### 添加 packagse：[lerna add](https://github.com/lerna/lerna/tree/master/commands/add#readme)

#### 本地调试：

1. [link 方式](https://docs.npmjs.com/cli/link.html) 再执行（建议）

```
npm run watch:js
```

2. 自己编写个 html 调试再执行

```
npm run watch:js
```