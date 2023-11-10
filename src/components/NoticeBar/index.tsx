import React, {
  useState, useCallback, Fragment, useMemo, useEffect,
} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import parse from 'html-react-parser';
import {FaTimes} from 'react-icons/fa';
import {useQuery} from '@apollo/client';

import {GET_NOTICES} from '@services/queries';

const NoticeModal = ({
  isVisible, item, toggleModal,
}: {isVisible: boolean, item: {title: string, description: string}, toggleModal(): void}) => (
  <Transition appear show={isVisible} as={Fragment}>
    <Dialog as='div' className='relative z-10' onClose={toggleModal}>
      <Transition.Child
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div className='fixed inset-0' />
      </Transition.Child>
      <div className='fixed inset-0 overflow-y-auto bg-[#000] bg-opacity-60'>
        <div className='flex min-h-full items-center justify-center p-1 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='lg:w-[670px] max-w-[90%] transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all bg-color-white'>
              <Dialog.Title
                as='h3'
                className='flex items-center justify-between text-3xl font-semibold border-b border-solid border-[#f7f7f7] pb-3'
              >
                {item.title}
                <span onClick={toggleModal} className='cursor-pointer text-[#000] text-3xl font-sans'>
                  ×
                </span>
              </Dialog.Title>
              <Dialog.Description className='relative py-6 flex-auto max-h-[400px] overflow-y-auto'>
                {parse(item.description)}
              </Dialog.Description>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

const Notice = ({noticeType = 'PUBLIC', setVisible} : {noticeType?: string, setVisible?: any}) => {
  const {data} = useQuery(GET_NOTICES);

  const [showBar, setShowBar] = useState(true);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const activeNotice = useMemo(() => data?.notice?.find(
    (el: {noticeType: string}) => el.noticeType === noticeType,
  ), [data?.notice, noticeType]);

  const handleCloseClick = useCallback(() => {
    setShowBar(false);
    if (noticeType === 'USER') {
      setVisible(false);
    }
  }, [noticeType, setVisible]);

  const handleNoticeModal = useCallback(() => {
    setShowNoticeModal(!showNoticeModal);
  }, [showNoticeModal]);

  useEffect(() => {
    if (activeNotice && noticeType === 'USER') {
      setVisible(true);
    }
  }, [activeNotice, noticeType, setVisible]);

  if (activeNotice) {
    return (
      <div className='bg-color-blue z-10 sticky top-0 left-0 right-0'>
        {showBar && (
          <div className='max-w-[1440px] mx-auto px-[5vw] flex justify-between font-inter align-center py-2'>
            <div />
            <div className='flex align-center cursor-pointer' onClick={handleNoticeModal}>
              <p className='text-color-white'>{activeNotice.title}</p>
              <span className='ml-[10px] text-[#EC6D25] font-interSemibold'>Learn More</span>
            </div>
            <div onClick={handleCloseClick} className='cursor-pointer bg-color-blue-alt flex justify-center items-center h-6 w-6 rounded-3xl'>
              <span className='text-color-white font-sans'>
                <FaTimes />
              </span>
            </div>
          </div>
        )}
        <NoticeModal
          item={activeNotice}
          isVisible={showNoticeModal}
          toggleModal={handleNoticeModal}
        />
      </div>
    );
  }

  return null;
};

export default Notice;
