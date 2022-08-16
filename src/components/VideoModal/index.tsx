import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';

const VideoModal = ({
  isVisible, title, videoUrl, toggleModal,
}: {isVisible: boolean, title?: string, videoUrl?: string, toggleModal(): void}) => (
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
            <Dialog.Panel className='lg:w-[670px] max-w-[90%] transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all bg-[#fff]'>
              <Dialog.Title
                as='h3'
                className='flex items-center justify-between text-3xl font-semibold border-b border-solid border-[#f7f7f7] pb-3'
              >
                {title}
                <span onClick={toggleModal} className='cursor-pointer text-[#000] text-3xl font-sans'>
                  ×
                </span>
              </Dialog.Title>
              <div className='relative pt-6 flex-auto h-[400px]'>
                <iframe
                  width='100%'
                  height='100%'
                  src={videoUrl}
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  title='Embedded youtube'
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default VideoModal;
