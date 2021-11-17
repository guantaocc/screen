/**
 * 
 */

// Find 向下查找所有子组件
export function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.componentName === componentName) components.push(child);
    return components
  }, []);
}

// 查找第一个符合条件的父组件
// Find components upward
export function findComponentUpward(context, componentName) {
  let parent = context.$parent;
  let name = parent.$options.componentName;

  while (parent && (!name || componentName !== name)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.componentName;
  }

  return parent;
}
