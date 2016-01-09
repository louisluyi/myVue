Vue模块构建测试
以下是每个目录的职责
/build：存放webpack打包后的文件，可以直接引用
/components：存放构建模块所需的vue和css文件
/config：存放webpack配置文件，遵循commonJS规范，命名请用module.config.js，即对应module的打包配置
配置方式请参考base.config.js，文档请参考http://webpack.github.io/docs/configuration.html
/libraries：存放依赖的其他库，比如vue-router, vue-resource，尽量不依赖jquery
/node_modules：存放node模块，不要提交
/src：存放构建页面需要执行的文件，组装需要的/components里面的模块，打包生成/build里面可以直接被页面引用的js
/package.json：包描述文件
所有js文件均可使用es6，打包时会自动生成对应的es5代码，css可以使用stylus,sass(可选),less(可选)