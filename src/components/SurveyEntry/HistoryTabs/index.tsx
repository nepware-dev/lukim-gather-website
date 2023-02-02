import React, {useCallback} from 'react';

import cs from '@ra/cs';

import classes from './styles';

const HistoryTabItem: React.FC<any> = ({
  item,
  activeTabId,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    if (activeTabId !== item.id) {
      onClick?.(item);
    }
  }, [onClick, item, activeTabId]);

  return (
    <div
      className={cs(classes.versionTabItem, {
        [classes.versionTabItemActive]: activeTabId === item.id,
      })}
      onClick={handleClick}
    >
      <span>{item.title}</span>
    </div>
  );
};

const HistoryTabs: React.FC<any> = ({
  tabsData,
  onChangeTab,
  activeTabId,
  className,
}) => (
  <div className={className}>
    {tabsData.map((tabItem: {id: string | number}) => (
      <HistoryTabItem
        key={tabItem.id}
        item={tabItem}
        onClick={onChangeTab}
        activeTabId={activeTabId}
      />
    ))}
  </div>
);

export default HistoryTabs;
