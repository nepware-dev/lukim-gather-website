type ObjectType = {
  id: string | number,
  firstName: string,
  lastName: string,
};

export const formatName = (obj: ObjectType) => {
  if (!obj) return 'Anonymous';
  if (!obj.firstName && !obj.lastName) return 'No name';
  return `${obj.firstName} ${obj.lastName}`;
};
