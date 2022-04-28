/* eslint-disable @typescript-eslint/no-explicit-any */
export const searchTree = (
  tree: any,
  value: number | string,
  key = 'id',
  reverse = false,
) => {
  const stack = [...tree];
  while (stack.length) {
    const node = stack[reverse ? 'pop' : 'shift']();
    if (Number(node[key]) === Number(value)) {
      return node;
    }
    if (node.childs) {
      stack.push(...node.childs);
    }
  }
  return null;
};
