import React, {useCallback, useState} from 'react';
import {HiOutlineX} from 'react-icons/hi';

import Button from '@components/Button';
import {Data} from '@components/SurveyTable';

import tree from '@images/category-tree.png';
import jungle from '@images/jungle.png';

interface Props {
  data: Data;
  setShowDetails(value: boolean): void;
}

const Title = ({text}: {text: string}) => (
  <div className='h-[32px] mt-[32px] mb-[12px] flex items-center bg-[#E6EEF3] px-[10px] rounded'>
    <h3 className='font-inter font-[400] text-[14px] text-[#585D69] uppercase'>
      {text}
    </h3>
  </div>
);

const Feel = () => (
  <div className='flex items-center justify-center h-[56px] w-[67px] bg-[#F0F3F6] border border-[#B3CBDC] rounded-lg'>
    <p className='text-[24px]'>🙂</p>
  </div>
);

const SurveyEntry: React.FC<Props> = ({data, setShowDetails}) => {
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);

  const handleShowDeclineModal = useCallback(() => {
    setShowDeclineModal(true);
  }, []);

  const handleHideDeclineModal = useCallback(() => {
    setShowDeclineModal(false);
  }, []);

  const handleDecline = useCallback(() => {
    setShowDeclineModal(false);
    setShowDetails(false);
  }, [setShowDetails]);

  const hideDetails = useCallback(() => {
    setShowDetails(false);
  }, [setShowDetails]);

  return (
    <div>
      <div className='flex justify-end fixed top-0 bottom-0 left-0 right-0 bg-[#10182880] overflow-y-scroll z-10'>
        <div className='h-fit w-[625px] bg-[#fff] pt-[28px] px-[18px]'>
          <div
            className='flex items-center justify-center h-[24px] w-[24px] bg-[#E7E8EA] rounded-full cursor-pointer'
            onClick={hideDetails}
          >
            <HiOutlineX size={14} />
          </div>
          <div className='flex items-center justify-between mt-[35px] mb-[12px]'>
            <h2 className='font-inter font-[600] text-[24px]'>{data.survey}</h2>
            <p
              className={`max-w-fit px-[12px] py-[4px] rounded-full uppercase font-inter font-[600] text-[14px] ${
                data.status === 'Pending' && 'bg-[#FFF3E2] text-[#F79009]'
              } ${
                data.status === 'Declined' && 'bg-[#FFEFEE] text-[#F04438]'
              } ${data.status === 'Approved' && 'bg-[#E7F5EF] text-[#12B76A]'}`}
            >
              {data.status}
            </p>
          </div>
          <p className='font-inter font-[400] text-[16px] text-[#585D69]'>
            {data.date}
          </p>
          <Title text='category' />
          <div className='flex items-center gap-[10px]'>
            <img src={tree} alt='category' className='h-[20px]' />
            <p className='font-inter font-[500] text-[16px] leading-[19.36px]'>
              {data.category}
            </p>
          </div>
          <Title text='photos' />
          <div className='flex gap-[12px] overflow-x-scroll'>
            <img
              src={jungle}
              alt=''
              className='h-[143px] w-[187px] rounded-lg'
            />
            <img
              src={jungle}
              alt=''
              className='h-[143px] w-[187px] rounded-lg'
            />
            <img
              src={jungle}
              alt=''
              className='h-[143px] w-[187px] rounded-lg'
            />
            <img
              src={jungle}
              alt=''
              className='h-[143px] w-[187px] rounded-lg'
            />
          </div>
          <Title text='feels' />
          <div>
            <Feel />
          </div>
          <Title text='Description' />
          <div>
            <p className='font-inter font-[400] text-[16px] text-[#282F3E] leading-[24px]'>
              The forest is a complex ecosystem consisting mainly of trees that
              buffer the earth and support a myriad of life forms. The trees
              help create a special environment which, in turn, affects the
              kinds of animals and plants that can exist in the forest. Trees
              are an important component of the environment.
            </p>
          </div>
          <Title text='Location' />
          <div>
            <p className='font-inter font-[400] text-[16px] text-[#282F3E] leading-[24px]'>
              Kikori, Papua New Guinea
            </p>
          </div>
          <div className='h-[229px] bg-color-blue mt-[8px] rounded-lg flex items-center justify-center'>
            Map
          </div>
          <div className='flex justify-between gap-[16px] my-[52px]'>
            <Button text='Accept' className='w-[100%]' onClick={hideDetails} />
            <Button
              text='Decline'
              className='w-[100%] bg-[#E7E8EA]'
              textClassName='text-[#F04438]'
              onClick={handleShowDeclineModal}
            />
          </div>
        </div>
      </div>
      <div
        className={`${
          !showDeclineModal && 'hidden'
        } flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-[#10182880] z-20`}
      >
        <div className='w-[629px] bg-[#fff] rounded-2xl'>
          <div className='flex items-center justify-between h-[80px] px-[20px] bg-[#E7ECF2] rounded-t-2xl'>
            <p className='font-inter font-[600] text-[24px] text-[#101828]'>
              Are you sure you want to decline the entry?
            </p>
            <div
              className='flex items-center justify-center h-[24px] w-[24px] bg-[#fff] rounded-full cursor-pointer'
              onClick={handleHideDeclineModal}
            >
              <HiOutlineX size={14} />
            </div>
          </div>
          <div className='px-[20px] mt-[20px] mb-[32px]'>
            <p className='font-inter font-[500] text-[16px] text-[#404653] mb-[8px]'>
              Reasons why it is declined (optional)
            </p>
            <textarea className='w-[100%] p-[10px] font-inter font-[500] text-[16px] border border-[#CCDCE8] rounded-lg' />
            <div className='flex justify-end gap-[8px] mt-[20px]'>
              <Button
                text='Cancel'
                onClick={handleHideDeclineModal}
                className='bg-[#E7E8EA]'
                textClassName='text-[#404653]'
              />
              <Button
                text='Yes, decline'
                onClick={handleDecline}
                className='bg-[#F04438]'
                textClassName='text-[#fff]'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyEntry;
