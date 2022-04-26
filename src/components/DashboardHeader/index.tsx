import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsArrowLeftShort} from 'react-icons/bs';

import cs from '@utils/cs';
import UserDropdown from '@components/UserDropdown';

interface Props {
  title?: string;
}

const classes = {
  container: 'hidden md:flex h-[84px] w-[100%] px-[20px] justify-between items-center border-b border-[#CCDCE8]',
  title: 'font-inter font-[600] text-[24px] text-[#101828]',
  wrapper: 'flex items-center gap-[12px] cursor-pointer',
  text: 'font-inter font-[400] text-[16px] text-[#101828]',
  hidden: 'hidden',
};

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
