import React, {
  useState, useCallback, useEffect, Fragment,
} from 'react';
import {Dialog, Transition} from '@headlessui/react';

import {RootStateOrAny, useSelector} from 'react-redux';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import parse from 'html-react-parser';
import {FaTimes} from 'react-icons/fa';
import {gql, useQuery} from '@apollo/client';

const GET_NOTICES = gql`
  query{
    notice {
      id
      noticeType
      title
      description
    }
  }
`;

export interface WithRouterProps {
  location: ReturnType<typeof useLocation>;
  params: Record<string, string>;
  navigate: ReturnType<typeof useNavigate>;
}

const withRouter = <T extends WithRouterProps>(
  Component: React.ComponentType<T>,
) => (props: Omit<T, keyof WithRouterProps>) => {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    return (
      <Component
        {...(props as T)}
        location={location}
        params={params}
        navigate={navigate}
      />
    );
  };

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

const Notice = (props: any) => {
  const {data} = useQuery(GET_NOTICES);
  const isAuthenticated = useSelector((state: RootStateOrAny) => state.auth.isAuthenticated);
  const [noticeType, setNoticeType] = useState('PUBLIC');
  const [showBar, setShowBar] = useState(true);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props?.location?.pathname.startsWith('/dashboard') && !hasClosed) {
      setNoticeType('USER');
      return setShowBar(true);
    }
    return setNoticeType('PUBLIC');
  }, [hasClosed, isAuthenticated, props]);

  const activeNotice = data?.notice?.find(
    (el: {noticeType: string}) => el.noticeType === noticeType,
  );

  const handleCloseClick = useCallback(() => {
    if (noticeType === 'USER') {
      setHasClosed(true);
    }
    setShowBar(false);
  }, [noticeType]);

  const handleNoticeModal = useCallback(() => {
    setShowNoticeModal(!showNoticeModal);
  }, [showNoticeModal]);

  if (activeNotice) {
    return (
      <div className='bg-color-blue z-20 sticky top-0 left-0 right-0'>
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

export default withRouter(Notice);
