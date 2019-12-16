基于[yddict](<https://github.com/kenshinji/yddict>) 、[NodeMail](<https://github.com/Vincedream/NodeMail>) 这俩个项目开发的这个项目。

功能是获取当天One网站的数据，然后将其图片保存到本地D盘根目录。

## Install	

我已经发布为`npm`包了，可以试验一下。

``` 
npm i -g tk-one
one
```

或者可以直接下载代码到本地：

```
git clone https://github.com/tiakia/one.git
npm install
node index.js
```

运行上述代码都会将One当天的数据作为图片保存到D盘根目录。

### 卸载全局安装的npm包

```
npm uninstall -g tk-one
```



## 步骤

- 从[One](<http://wufazhuce.com/>)获取数据
- 使用`canvas`绘制图片，这里有多种实现方案：
  - 使用 ﻿puppeteer截图保存图片，或者截图返回buffer数据保存本地。
  - canvas转为base64，发送给node通过Buffer对象保存在本地

项目为Demo试验用，主要是为了熟悉一下npm包的发布流程，以及nodejs中buffer对象转换数据和回顾一下canvas绘画相关知识。
