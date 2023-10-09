type TreeObject = {
  childs: TreeObject[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type ObjectType = {
  [key: string]: ObjectType;
};

type SearchTreeFunction = (
  tree: TreeObject[],
  value: number | string,
  key?: string,
  reverse?: boolean,
) => TreeObject | undefined | null;

export const searchTree: SearchTreeFunction = (
  tree: TreeObject[],
  value: number | string,
  key = 'id',
  reverse = false,
) => {
  const stack = [...tree];
  while (stack.length) {
    const node = stack[reverse ? 'pop' : 'shift']();
    if (Number(node?.[key]) === Number(value)) {
      return node;
    }
    if (node?.childs) {
      stack.push(...node.childs);
    }
  }
  return null;
};

export const findPropertyAnywhere = (object: ObjectType, key: string) => {
  let value;
  Object.keys(object).some((k) => {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = findPropertyAnywhere(object[k], key);
      return value !== undefined;
    }
    return false;
  });
  return value;
};
