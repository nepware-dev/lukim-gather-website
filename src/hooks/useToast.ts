import {dispatchAddToast, dispatchDeleteToast} from '@services/dispatch';

const useToast = () => {
  function toast(type: string, message: string) {
    const id = Date.now();
    dispatchAddToast(type, message, id);

    setTimeout(() => {
      dispatchDeleteToast(id);
    }, 4000);
  }

  return toast;
};

export default useToast;
