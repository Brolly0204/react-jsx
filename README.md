# boilerplate-jsx

### 实现jsx解析器与渲染器
- 安装依赖运行npm start。
- 调试playground.js，看看jsx编译后的结果是什么。
- 实现一个数据结构，把jsx编译后的结构以嵌套形式保存在数据结构对象中（参考react渲染）。
- 实现render，解析这个嵌套对象，并且把解析结果渲染到页面上。
- 实现事件 属性挂载
更新内容未实现。

### 启动准备

```
npm i
npm start
```

### 学习总结
react jsx 语法通过 babel-preset-react 编译成createElement函数形式

```
<div className="root">
  <h3>hello wenli</h3>
</div>
```

babel编译为如下

```
React.createElement(
  "div",
  { className: "root" },
  React.createElement(
    "h3",
    null,
    "hello wenli"
  )
);
```

createElement函数返回的就是 一个个React元素（所谓 虚拟DOM），其实就是一个普通JavaScript描述对象。这些虚拟DOM组成为虚拟DOM TREE，以树状结构来描述真实DOM TREE

```
<div className='app'>hello</div>
{
  type: 'div',
  {class: 'app'},
  'hello'
}

多层
<div className='app'>
  <h3>hello title</h3>
  hi react
</div>

{
  type: 'div',
  props: {class: 'app'},
  children: [
      {
        type: 'h3',
        props: null,
        children: 'hello title'
      },
      {
         type: null,
         props: null,
         children: 'hi react'
      },
  ]
}
```

最后render函数根据虚拟DOM 渲染成真实dom

更新需要 新的虚拟DOM 和 旧的虚拟DOM进行差异对比，也就是通过 dom diff 算法生成patch，以最小代价修改真实DOM 再次调用render 映射到真实DOM上

### dom diff
在实际项目中，随着页面数据变化（用户交互）或者后端数据返回，更新大多数只有三种情况：
- dom的属性或者内容更新（update）。
- dom元素类型发生变化(insert)。
- dom元素的位置发生变化，或者新增(insert)，后者删除(remove)。