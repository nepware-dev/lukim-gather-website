import {useMemo} from 'react';
import {useQuery} from '@apollo/client';

import {GET_SUPPORT_CATEGORY} from '@services/queries';

const useSupportCategory = (treeId?: string | null) => {
  const {data: category} = useQuery(GET_SUPPORT_CATEGORY);
  const parentCategory = useMemo(() => {
    const data = category?.supportCategory?.filter((e:any) => e.parent != null);
    const lookup: any = [];
    return data?.map((e: any) => {
      if (lookup?.includes(e.parent.title)) {
        return null;
      }
      lookup?.push(e.parent.title);
      return e;
    })?.filter((data: any) => data !== null);
  }, [category]);

  const childCategory = useMemo(
    () => (treeId ? parentCategory?.find((e: any) => e.treeId === treeId) : []),
    [parentCategory, treeId],
  );

  return {parentCategory, childCategory};
};

export default useSupportCategory;
