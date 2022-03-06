import React from 'react';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

const Home = () => (
  <main className='h-screen'>
    <div className='bg-color-bg w-[100%]'>
      <div className='max-w-[1440px] mx-auto px-[5%]'>
        <Navbar />
      </div>
    </div>
    <div className='max-w-[1440px] mx-auto px-[5%]'>
      <Footer />
    </div>
  </main>
);

export default Home;
