const user = { name: 'test' }

function handle() {
  alert('message')
}
// debugger
const App = () => {
  return <div>
    <h3
      className='title'
      style={{color: 'red', fontSize: '20px'}}
      onClick={handle}
    >hello react</h3>
    <input type="text" value={123}/>
    <span>{user.name}</span>
  </div>
}

// 创建react元素 虚拟的DOM TREE
function createElement(node = '', props = {}, ...childrens) {
  if (typeof node === 'function') return node();
  if (typeof node === 'string') {
    return new ReactElement(node, props, ...childrens)
  }
}

// 生成vnode结构
function ReactElement(node, props = {}, ...childrens) {
  this.type = node;
  this.props = props;
  this.childrens = childrens || [];
}

// 渲染vDOM
function render(vnode, container) {
  let element;
  if (typeof vnode === 'string') {
    element = document.createTextNode(vnode);
  } else {
    element = document.createElement(vnode.type);
    if (element.tagName.toUpperCase() === 'INPUT') {
      setAttribute(element, 'type', vnode.props.type);
      setAttribute(element, 'value', vnode.props.value);
    } else {
      for (key in vnode.props) {
        setAttribute(element, key, vnode.props[key])
      }
      for (let i = 0; i < vnode.childrens.length; i++) {
        render(vnode.childrens[i], element);
      }
    }
  }
  container.appendChild(element);
  return element;
}

// 设置属性方法
function setAttribute(ele, key, value) {
  if (key === 'className') {
    ele.setAttribute('class', value)
  } else if (key === 'htmlFor') {
    ele.setAttribute('for', value)
  } else if (key === 'style') {
    Object.assign(ele.style, value);
  } else if (/^on(\w+)$/.test(key)) {
    ele.addEventListener(RegExp.$1.toLowerCase(), value, false);
  } else {
    ele.setAttribute(key, value)
  }
}

render(
  <App />,
  document.getElementById('root')
);