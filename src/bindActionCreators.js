function bindActionCreator(actionCreator, dispatch) {
  return function() {
    //  为什么这里是 函数的 apply，不是应该是 对象 {type:''} 的吗？
    // 因为传进来的第一参数，就必须是函数 - - ，目的是为了传入 dispatch
    // actionCreator.apply 结果应该是 {type:''}
    return dispatch(actionCreator.apply(this, arguments))
  }
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 * 如果 action 是函数，会一直递归，直到它是一个 对象{type:''} 
 */
export default function bindActionCreators(actionCreators, dispatch) {
  // actionCreators =  {type:'',xx:''}
  if (typeof actionCreators === 'function') {
    // 结果值： function(){return actionCreators}
    return bindActionCreator(actionCreators, dispatch) 
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    // todo 为什么是函数了，才给绑定到对象并返回；
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }

  }
   // 返回了一个对象，属性值是 { xx : function(){return actionCreators} } 

  return boundActionCreators
}
