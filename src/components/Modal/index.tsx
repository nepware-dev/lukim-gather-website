import React from 'react';
import Button from '@components/Button';
import {CgClose} from 'react-icons/cg';

import Modal from '@ra/components/Modal';

import classes from './styles';

export enum ActionType {
  Warning = 'Warning',
  Danger = 'Danger',
  Neutral = 'Neutral',
  Primary = 'Primary',
}

interface modalActions {
  label: string;
  onClick: () => void;
  type: ActionType;
}

interface Props {
  title: string;
  children: React.ReactElement;
  actions: modalActions[];
  isVisible: boolean;
  onClose: () => void;
}

const Component: React.FC<Props> = ({
  title, children, actions, isVisible, onClose,
}) => (
  <Modal isVisible={isVisible} className={classes.modal}>
    <div className={classes.header}>
      {title}
      <div className={classes.closeIcon} onClick={onClose}>
        <CgClose size={16} />
      </div>
    </div>
    <div className={classes.content}>
      {children}
    </div>
    <div className={classes.actions}>
      {actions.map((action) => (
        <Button
          text={action.label}
          className={`${classes[action.type]}`}
          textClassName={classes[`text${action.type}`]}
          onClick={action.onClick}
        />
      ))}
    </div>
  </Modal>
);

export default Component;
