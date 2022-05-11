import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsArrowLeftShort} from 'react-icons/bs';

import cs from '@utils/cs';
import UserDropdown from '@components/UserDropdown';

import classes from './styles';

interface Props {
  title?: string;
}

const DashboardHeader: React.FC<Props> = ({title}) => {
  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={classes.container}>
      <h1 className={cs(classes.title, [classes.hidden, !title])}>{title}</h1>
      <div
        onClick={handleGoBack}
        className={cs(classes.wrapper, [classes.hidden, !!title])}
      >
        <BsArrowLeftShort size={25} color='#101828' />
        <p className={classes.text}>Back</p>
      </div>
      <UserDropdown alignRight />
    </div>
  );
};

export default DashboardHeader;
