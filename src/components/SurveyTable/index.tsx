import React, {useCallback, useState} from 'react';
import SurveyEntry from '@components/SurveyEntry';
import {formatDate} from '@utils/formatDate';

import tree from '@images/category-tree.png';

export type SurveyDataType = {
  id: number | string;
  title: string;
  description: string;
  attachment: {media: string}[];
  category: {title: string};
  createdAt: string;
  location: {type: string; coordinates: [number, number]};
  sentiment: string;
  status: string;
};

interface Props {
  data: SurveyDataType[];
}

interface ItemProps {
  item: SurveyDataType;
  index: number;
  setIndex(i: number): void;
  setShowDetails(value: boolean): void;
}

const titleStyle = 'text-left text-[#888C94] font-inter font-[500] text-[14px] uppercase';

const SurveyItem: React.FC<ItemProps> = ({
  item,
  index,
  setIndex,
  setShowDetails,
}) => {
  const handleClick = useCallback(() => {
    setIndex(index);
    setShowDetails(true);
  }, [index, setIndex, setShowDetails]);

  return (
    <tr className='h-[56px] border-t border-[#CCDCE8]'>
      <td>
        <p className='pl-[20px] text-[#282F3E] font-inter font-[500] text-[16px]'>
          {item.title}
        </p>
      </td>
      <td>
        <div className='flex items-center gap-[9px]'>
          <img src={tree} alt='category' className='h-[18px]' />
          <p className='text-[#282F3E] font-inter font-[400] text-[16px]'>
            {item.category.title}
          </p>
        </div>
      </td>
      <td>
        <p className='text-[#282F3E] font-inter font-[400] text-[16px]'>
          {formatDate(item.createdAt)}
        </p>
      </td>
      <td>
        <p
          className={`max-w-fit px-[12px] py-[4px] rounded-full uppercase font-inter font-[500] text-[12px] ${
            item.status.toLowerCase() === 'pending'
            && 'bg-[#FFF3E2] text-[#F79009]'
          } ${
            item.status.toLowerCase() === 'declined'
            && 'bg-[#FFEFEE] text-[#F04438]'
          } ${
            item.status.toLowerCase() === 'approved'
            && 'bg-[#E7F5EF] text-[#12B76A]'
          }`}
        >
          {item.status}
        </p>
      </td>
      <td>
        <button
          type='button'
          className='text-[#00518B] font-inter font-[500] text-[14px] lg:-mr-[20px]'
          onClick={handleClick}
        >
          View entry
        </button>
      </td>
    </tr>
  );
};

const SurveyTable: React.FC<Props> = ({data}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  return (
    <>
      <div className='mt-[16px] border border-[#CCDCE8] rounded'>
        <table className='table-auto w-[100%] border-collapse'>
          <thead>
            <tr className='h-[41px] border-b border-[#CCDCE8]'>
              <th>
                <p className={`${titleStyle} pl-[20px]`}>Survey</p>
              </th>
              <th>
                <p className={titleStyle}>Category</p>
              </th>
              <th>
                <p className={titleStyle}>Date</p>
              </th>
              <th>
                <p className={titleStyle}>Status</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((item: SurveyDataType, index: number) => (
                <SurveyItem
                  key={item.id}
                  item={item}
                  index={index}
                  setIndex={setActiveIndex}
                  setShowDetails={setShowDetails}
                />
              ))
            ) : (
              <tr>
                <td>
                  <p className='p-[20px] text-[#282F3E] font-inter font-[400] text-[16px]'>
                    No Survey Found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showDetails && (
        <SurveyEntry data={data[activeIndex]} setShowDetails={setShowDetails} />
      )}
    </>
  );
};

export default SurveyTable;
