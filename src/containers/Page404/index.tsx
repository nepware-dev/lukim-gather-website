import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import Navbar from '@components/Navbar';
import Button from '@components/Button';

import image404 from '@images/404.png';

import classes from './styles';

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
                text='Take me to the homepage'
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
