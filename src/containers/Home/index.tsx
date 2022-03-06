import React from 'react';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import AppButton from '@components/AppButton';

import HeroImage from '@images/lukim-hero.png';

const Home = () => (
  <main>
    <div className='bg-color-bg w-[100%]'>
      <div className='max-w-[1440px] mx-auto px-[5%]'>
        <Navbar />
        <div className='py-[120px] flex flex-row'>
          <div className='w-[50%]'>
            <h1 className='font-sans font-[700] leading-[68px] text-[64px] text-color-blue'>
              The Lukim Gather Mobile Data Application
            </h1>
            <p className='font-inter font-[400] text-[18px] text-color-text leading-[26px] my-[28px]'>
              How do we ensure that community data from Papua New Guinea’s
              protected areas is reported and heard?
            </p>
            <p className='font-inter font-[600] text-[18px] leading-[26px]'>
              Pilot phase in May 2022 Coming to app stores in August 2022
            </p>
            <div className='flex flex-row gap-[12px] mt-[28px]'>
              <AppButton />
              <AppButton android />
            </div>
          </div>
          <div className='flex align-center justify-center w-[50%]'>
            <img
              src={HeroImage}
              alt='lukim-mobile-app'
              className='max-h-[450px]'
            />
          </div>
        </div>
      </div>
    </div>
    <div className='max-w-[1440px] mx-auto px-[5%]'>
      <Footer />
    </div>
  </main>
);

export default Home;
