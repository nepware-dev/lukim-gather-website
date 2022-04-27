import {useMemo, useCallback} from 'react';
import {searchTree} from '@utils/searchTree';
import SurveyCategory from '../data/surveyCategory';

const useCategoryIcon = (id: string | number) => {
  const getIcon = useCallback((item, categoryId) => {
    if (!categoryId) {
      return null;
    }
    const node = searchTree(item, categoryId);
    return node?.icon;
  }, []);

  const iconSrc = useMemo(
    () => getIcon(SurveyCategory, id),
    [getIcon, id],
  );
  return [iconSrc];
};

export default useCategoryIcon;
