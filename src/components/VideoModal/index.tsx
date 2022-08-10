import React from 'react';

const VideoModal = ({
  isVisible, title, videoUrl, toggleModal,
}: {isVisible: boolean, title?: string, videoUrl?: string, toggleModal(): void}) => {
  if (!isVisible) {
    return null;
  }
  return (
    <div
      className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-2 outline-none focus:outline-none bg-[#000] bg-opacity-60'
    >
      <div className='relative w-full mx-auto lg:max-w-[670px] md:max-w-[90%] bg-[#fff]'>
        <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
          <div className='flex items-start justify-between px-5 py-4 border-b border-solid border-[#f7f7f7] rounded-t'>
            <h3 className='text-3xl font-semibold'>
              {title}
            </h3>
            <div onClick={toggleModal} className='cursor-pointer'>
              <span className='text-[#000] text-3xl font-sans'>
                ×
              </span>
            </div>
          </div>
          <div className='relative p-6 flex-auto h-[400px]'>
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
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
