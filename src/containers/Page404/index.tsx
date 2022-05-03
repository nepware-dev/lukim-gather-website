import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import Navbar from '@components/Navbar';
import Button from '@components/Button';

import image404 from '@images/404.png';

const classes = {
  mainContainer: 'bg-color-bg w-[100%] min-h-screen',
  container: 'max-w-[1440px] mx-auto px-[5vw] lg:relative',
  section: 'py-[20px] flex flex-col items-center gap-[50px] sm:py-[50px] lg:py-[100px] lg:flex-row lg:gap-[20px]',
  content: 'lg:w-[50%]',
  text404: 'font-interSemibold text-[#EC6D25] text-[24px] leading-[29.05px]',
  title: 'font-interSemibold leading-[44px] text-[36px] text-[#282F3E] sm:leading-[58px] sm:text-[48px]',
  text: 'max-w-[446px] font-inter text-[16px] leading-[24px] text-[#404653] my-[28px] sm:text-[18px] sm:leading-[32px]',
  imageWrapper: 'sm:flex sm:align-center sm:justify-center lg:w-[50%]',
  image404: 'max-h-[400px]',
  button: 'max-w-[226px] bg-[#fff]',
  buttonText: 'font-interSemibold text-[#EC6D25]',
};

const Page404 = () => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <main>
      <div className={classes.mainContainer}>
        <div className={classes.container}>
          <Navbar />
          <section className={classes.section}>
            <div className={classes.content}>
              <p className={classes.text404}>404</p>
              <h1 className={classes.title}>Page not found</h1>
              <p className={classes.text}>
                {'The page you are looking for doesn\'t exist or has been moved.'}
              </p>
              <Button
                onClick={handleClick}
                text='Take me to the home'
                className={classes.button}
                textClassName={classes.buttonText}
              />
            </div>
            <div className={classes.imageWrapper}>
              <img src={image404} alt='404' className={classes.image404} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Page404;
