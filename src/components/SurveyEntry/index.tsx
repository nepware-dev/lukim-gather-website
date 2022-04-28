import React, {useCallback, useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import {HiOutlineX} from 'react-icons/hi';

import {formatDate} from '@utils/formatDate';
import useCategoryIcon from '@hooks/useCategoryIcon';

import Button from '@components/Button';
import Map from '@components/Map';
import {SurveyDataType} from '@components/SurveyTable';
import {GET_SURVEY_DATA} from '@containers/Surveys';

import tree from '@images/category-tree.png';

interface Props {
  data: SurveyDataType;
  setShowDetails(value: boolean): void;
}

const Title = ({text}: {text: string}) => (
  <div className='h-[32px] mt-[32px] mb-[12px] flex items-center bg-[#E6EEF3] px-[10px] rounded'>
    <h3 className='font-inter font-[400] text-[14px] text-[#585D69] uppercase'>
      {text}
    </h3>
  </div>
);

const Feel = ({sentiment}: {sentiment: string}) => (
  <div className='flex items-center justify-center h-[56px] w-[67px] bg-[#F0F3F6] border border-[#B3CBDC] rounded-lg'>
    <p className='text-[24px]'>{sentiment}</p>
  </div>
);

const UPDATE_SURVEY_STATUS = gql`
  mutation UpdateHappeningSurvey(
    $data: UpdateHappeningSurveyInput!
    $id: UUID!
  ) {
    updateHappeningSurvey(data: $data, id: $id) {
      ok
      result {
        status
      }
      errors
    }
  }
`;

const SurveyEntry: React.FC<Props> = ({data, setShowDetails}) => {
  const [updateHappeningSurvey] = useMutation(UPDATE_SURVEY_STATUS, {refetchQueries: [GET_SURVEY_DATA, 'happeningSurveys']});
  const [categoryIcon] = useCategoryIcon(data?.category?.id);
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);

  const handleShowDeclineModal = useCallback(() => {
    setShowDeclineModal(true);
  }, []);

  const handleHideDeclineModal = useCallback(() => {
    setShowDeclineModal(false);
  }, []);

  const hideDetails = useCallback(() => {
    setShowDetails(false);
  }, [setShowDetails]);

  const handleAccept = useCallback(async () => {
    await updateHappeningSurvey({variables: {data: {status: 'APPROVED'}, id: data.id}});
    setShowDetails(false);
  }, [data.id, setShowDetails, updateHappeningSurvey]);

  const handleDecline = useCallback(async () => {
    await updateHappeningSurvey({variables: {data: {status: 'REJECTED'}, id: data.id}});
    setShowDeclineModal(false);
    setShowDetails(false);
  }, [data.id, setShowDetails, updateHappeningSurvey]);

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
            <h2 className='font-inter font-[600] text-[24px]'>{data?.title}</h2>
            <p
              className={`max-w-fit px-[12px] py-[4px] rounded-full uppercase font-inter font-[600] text-[14px] ${
                data.status.toLowerCase() === 'pending'
                && 'bg-[#FFF3E2] text-[#F79009]'
              } ${
                data.status.toLowerCase() === 'rejected'
                && 'bg-[#FFEFEE] text-[#F04438]'
              } ${
                data.status.toLowerCase() === 'approved'
                && 'bg-[#E7F5EF] text-[#12B76A]'
              }`}
            >
              {data.status}
            </p>
          </div>
          <p className='font-inter font-[400] text-[16px] text-[#585D69]'>
            {formatDate(data.createdAt)}
          </p>
          <Title text='category' />
          <div className='flex items-center gap-[10px]'>
            <img src={categoryIcon || tree} alt='category' className='h-[20px]' />
            <p className='font-inter font-[500] text-[16px] leading-[19.36px]'>
              {data.category.title}
            </p>
          </div>
          <Title text='photos' />
          <div
            className={`flex gap-[12px] ${
              data.attachment.length > 3 && 'overflow-x-scroll'
            }`}
          >
            {data.attachment.length
              ? data.attachment.map((item: {media: string}) => (
                <img
                  key={item.media}
                  src={item.media}
                  alt=''
                  className='h-[143px] w-[187px] rounded-lg'
                />
              ))
              : 'No Photos Found'}
          </div>
          <Title text='feels' />
          <div>
            <Feel sentiment={data.sentiment || '-'} />
          </div>
          <Title text='Description' />
          <div>
            <p className='font-inter font-[400] text-[16px] text-[#282F3E] leading-[24px]'>
              {data.description || 'No Description Found'}
            </p>
          </div>
          <Title text='Location' />
          <div>
            <p className='font-inter font-[400] text-[16px] text-[#282F3E] leading-[24px]'>
              -
            </p>
          </div>
          <div className='h-[229px] mt-[8px] rounded-lg'>
            <Map center={data?.location?.coordinates || [0, 0]} />
          </div>
          <div className='flex justify-between gap-[16px] my-[52px]'>
            <Button text='Accept' className='w-[100%]' onClick={handleAccept} />
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
