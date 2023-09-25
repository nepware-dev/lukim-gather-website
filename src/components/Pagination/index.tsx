import React, {useCallback} from 'react';
import {ArrowBtn, NumBtn} from '@components/Button';

interface Props {
  page: number;
  totalPages: number;
  handlePagination: (page: number) => void;
}

const Pagination: React.FC<Props> = ({page, totalPages, handlePagination}) => {
  const handleNext = useCallback(() => {
    handlePagination(page + 1);
  }, [handlePagination, page]);

  const handlePrevious = useCallback(() => {
    handlePagination(page - 1);
  }, [handlePagination, page]);

  return (
    <div className='flex sm:gap-[35px] gap:none justify-between sm:w-full w-[calc(100vw-40px)] pt-[17px] pb-[14px]'>
      <div>
        <ArrowBtn
          btnType='previous'
          disabled={page <= 1}
          onClick={handlePrevious}
        />
      </div>
      <div className='flex justify-between w-full px-4'>
        <NumBtn
          onClick={handlePagination}
          num={1}
          isActive={page === 1}
          isVisible={totalPages > 0}
        />
        {page > 3 && totalPages > 4 && <div className='flex items-center'>...</div>}
        <NumBtn
          onClick={handlePagination}
          num={page - 2}
          isVisible={page === totalPages && totalPages > 3}
        />
        <NumBtn
          onClick={handlePagination}
          num={page - 1}
          isVisible={page > 2}
        />
        <NumBtn
          onClick={handlePagination}
          num={page}
          isActive
          isVisible={page !== 1 && page !== totalPages}
        />
        <NumBtn
          onClick={handlePagination}
          num={page + 1}
          isVisible={page < totalPages - 1}
        />
        <NumBtn
          onClick={handlePagination}
          num={page + 2}
          isVisible={page === 1 && totalPages > 3}
        />
        {page < totalPages - 2 && totalPages > 4 && <div className='flex items-center'>...</div>}
        <NumBtn
          onClick={handlePagination}
          num={totalPages}
          isActive={page === totalPages}
          isVisible={totalPages > 1}
        />
      </div>
      <div>
        <ArrowBtn
          btnType='next'
          disabled={page >= totalPages}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default Pagination;
