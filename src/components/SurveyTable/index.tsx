import React from 'react';

export type Data = {
  id: number;
  survey: string;
  category: string;
  categoryImg: string;
  date: string;
  status: string;
};

interface Props {
  data: Data[];
}

const titleStyle = 'text-left text-[#888C94] font-inter font-[500] text-[14px] uppercase';

const SurveyTable: React.FC<Props> = ({data}) => (
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
        {data.map((item) => {
          const status = item?.status.toLowerCase();
          return (
            <tr className='h-[56px] border-t border-[#CCDCE8]'>
              <td>
                <p className='pl-[20px] text-[#282F3E] font-inter font-[500] text-[16px]'>
                  {item.survey}
                </p>
              </td>
              <td>
                <div className='flex items-center gap-[9px]'>
                  <img
                    src={item.categoryImg}
                    alt='category'
                    className='h-[18px]'
                  />
                  <p className='text-[#282F3E] font-inter font-[400] text-[16px]'>
                    {item.category}
                  </p>
                </div>
              </td>
              <td>
                <p className='text-[#282F3E] font-inter font-[400] text-[16px]'>
                  {item.date}
                </p>
              </td>
              <td>
                <p
                  className={`max-w-fit px-[12px] py-[4px] rounded-full uppercase font-inter font-[500] text-[12px] 
                   ${status === 'pending' && 'bg-[#FFF3E2] text-[#F79009]'} 
                   ${status === 'declined' && 'bg-[#FFEFEE] text-[#F04438]'}
                   ${status === 'approved' && 'bg-[#E7F5EF] text-[#12B76A]'}
                  `}
                >
                  {item.status}
                </p>
              </td>
              <td>
                <button
                  type='button'
                  className='text-[#00518B] font-inter font-[500] text-[14px] lg:-mr-[20px]'
                >
                  View entry
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default SurveyTable;
