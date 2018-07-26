const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i

function each(obj, fn) {
  return keys(obj).forEach((k) => {
    fn(obj[k], k)
  })
}

/** Attempt to set a DOM property to the given value.
 *  IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
  try {
    node[name] = value
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e)
    /* eslint-enable no-console */
  }
}

function eventProxy(e) {
  const listener = this._listeners[e.type]
  return Array.isArray(listener) ? listener.forEach(l => l(e)) : listener(e)
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *  If `value` is `null`, the attribute/handler will be removed.
 *
 *  @param {Element} node  An element to mutate
 *  @param {string} name  The name/key to set, such as an event or attribute name
 *  @param {any} old  The last value that was set for this name/node pair
 *  @param {any} value  An attribute value, such as a function to be used as an event handler
 *  @param {Boolean} isSvg  Are we currently diffing inside an svg?
 *  @private
 */
export function setAttribute(node, name, value, isSvg) {
  if (name === 'className') name = 'class'

  if (name === 'key' || name === 'ref') {
    // ignore
  } else if (name === 'class' && !isSvg) {
    node.className = value || ''
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      node.style.cssText = value || ''
    }

    if (value && typeof value === 'object') {
      each(value, (v, k) => {
        if (value[k] === undefined) {
          node.style[k] = ''
        } else {
          node.style[k] = typeof v === 'number' && IS_NON_DIMENSIONAL.test(k) === false ? (`${v}px`) : v
        }
      })
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (value) node.innerHTML = value.__html || ''
  } else if (name[0] === 'o' && name[1] === 'n') {
    const useCapture = name !== (name = name.replace(/Capture$/, ''))
    name = name.toLowerCase().substring(2)
    if (value) {
      node.addEventListener(name, eventProxy, useCapture)
    } else {
      node.removeEventListener(name, eventProxy, useCapture)
    }

    (node._listeners || (node._listeners = {}))[name] = value
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    setProperty(node, name, value == null ? '' : value)
    if (value == null || value === false) node.removeAttribute(name)
  } else {
    const ns = isSvg && (name !== (name = name.replace(/^xlink\:?/, '')))
    if (value == null || value === false) {
      if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase())
      else node.removeAttribute(name)
    } else if (typeof value !== 'function') {
      if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value)
      else node.setAttribute(name, value)
    }
  }
}

function setAttributes(attributes, element, invoke) {
  each(attributes, (attribute, name) => {
    if (/^on[A-Z]/.test(name) && typeof attribute === 'function') {
      setAttribute(element, name, (...argv) => invoke(attribute, ...argv))
    } else {
      setAttribute(element, name, attribute)
    }
  })
}

export function createElement(node, isSVG, invoke) {
  console.log(node);
  if (node.type === String) return document.createTextNode(node.value)

  const element = isSVG || node.tag === 'svg'
    ? document.createElementNS('http://www.w3.org/2000/svg', node.type)
    : document.createElement(node.type)

  if (node.attributes) {
    setAttributes(node.attributes, element, invoke)
  }

  return element
}

export function updateElement(node, element, invoke) {
  if (node.type === String) {
    element.nodeValue = node.value
  } else {
    setAttributes(node.attributes, element, invoke)
  }
}
