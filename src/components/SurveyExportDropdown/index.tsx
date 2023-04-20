import React, {useCallback} from 'react';
import {BiCopy} from 'react-icons/bi';

import Dropdown from '@components/Dropdown';

import pdfIcon from '@images/icons/pdf.svg';
import pngIcon from '@images/icons/image.svg';
import csvIcon from '@images/icons/csv.svg';

import classes from './styles';

const ExportOption = ({
  onClick,
  icon,
  title,
} : {
  onClick(): void;
  icon: string;
  title: string;
}) => (
  <div className={classes.exportOption} onClick={onClick}>
    <img src={icon} alt={title} />
    <p className={classes.exportOptionTitle}>{title}</p>
  </div>
);

export interface SurveyExportDropdownProps {
  className?: string;
  onExportPDF?: () => void;
  onExportImage?: () => void;
  onExportCSV?: () => void;
  onCopyLink: () => void;
}

const SurveyExportDropdown: React.FC<SurveyExportDropdownProps> = (props) => {
  const {
    className,
    onExportPDF,
    onExportImage,
    onExportCSV,
    onCopyLink,
  } = props;

  const renderLabel = useCallback(
    () => (
      <div className={classes.exportButton}>
        <span className='material-symbols-rounded text-[32px] text-[#70747e]'>ios_share</span>
      </div>
    ),
    [],
  );

  return (
    <div className={className}>
      <Dropdown renderLabel={renderLabel}>
        <div className={classes.exportOptions}>
          {onExportPDF && (
            <ExportOption icon={pdfIcon} title='PDF' onClick={onExportPDF} />
          )}
          {onExportImage && (
            <ExportOption icon={pngIcon} title='Image (PNG)' onClick={onExportImage} />
          )}
          {onExportCSV && (
            <ExportOption icon={csvIcon} title='Data (CSV)' onClick={onExportCSV} />
          )}
          <div className={classes.exportOption} onClick={onCopyLink}>
            <BiCopy fill='#888C94' size={22} />
            <p className={classes.exportOptionTitle}>Copy public link</p>
          </div>
        </div>
      </Dropdown>
    </div>

  );
};

export default SurveyExportDropdown;
