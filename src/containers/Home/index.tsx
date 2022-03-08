import React, {useCallback, useState} from 'react';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import AppButton from '@components/AppButton';
import InfoCard from '@components/InfoCard';
import Card from '@components/Card';

import HeroImage from '@images/lukim-hero.png';
import BgArt from '@images/bg-art.png';
import circle from '@images/circle.svg';
import upload from '@images/upload.svg';
import flag from '@images/flag.svg';
import members from '@images/members.png';
import civilSociety from '@images/civil-society.png';
import membersAlt from '@images/members-alt.png';
import mobile from '@images/mobile.png';

const Home = () => {
  const [email, setEmail] = useState<string>('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  return (
    <main>
      <div className='bg-color-bg w-[100%]'>
        <div className='max-w-[1440px] mx-auto px-[5vw] lg:pb-[320px] lg:relative'>
          <Navbar />
          <div className='py-[20px] flex flex-col gap-[50px] sm:py-[50px] lg:py-[120px] lg:flex-row lg:gap-[20px]'>
            <div className='lg:w-[50%]'>
              <h1 className='font-sans font-[700] leading-[44px] text-[36px] text-color-blue sm:leading-[68px] sm:text-[64px]'>
                The Lukim Gather Mobile Data Application
              </h1>
              <p className='font-inter font-[400] text-[16px] leading-[24px] text-color-text my-[28px] sm:text-[18px] sm:leading-[26px]'>
                How do we ensure that community data from Papua New Guinea’s
                protected areas is reported and heard?
              </p>
              <p className='font-inter font-[600] text-[16px] leading-[24px] sm:text-[18px] sm:leading-[26px]'>
                Pilot phase in May 2022
              </p>
              <p className='font-inter font-[600] text-[16px] leading-[24px] sm:text-[18px] sm:leading-[26px]'>
                Coming to app stores in August 2022
              </p>
              <div className='flex flex-col gap-[12px] mt-[28px] justify-center items-center sm:flex-row lg:justify-start'>
                <AppButton />
                <AppButton android />
              </div>
            </div>
            <div className='hidden sm:flex sm:align-center sm:justify-center lg:w-[50%]'>
              <img
                src={HeroImage}
                alt='lukim-mobile-app'
                className='max-h-[450px]'
              />
            </div>
          </div>
          <div>
            <h2 className='font-sans font-[700] text-[36px] leading-[44px] text-color-blue text-center mb-[56px] sm:text-[48px] sm:leading-[62px]'>
              Background
            </h2>
            <div className='flex flex-col items-center gap-[40px] lg:flex-row lg:justify-around lg:items-start lg:gap-[20px]'>
              <div>
                <img
                  src={BgArt}
                  alt='lukim-mobile-app'
                  className='max-h-[250px] max-w-[250px] sm:max-h-[375px] sm:max-w-[375px]'
                />
              </div>
              <div className='max-w-[604px]'>
                <p className='font-inter font-[400] text-[16px] leading-[24px] text-color-text sm:text-[18px] sm:leading-[32px]'>
                  As part of the UNDP
                  <a
                    href='https://www.png-nrmhub.org'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <span className='text-color-green'>
                      {' '}
                      Papua New Guinea’s Natural Resource Hub
                    </span>
                  </a>
                  , the second phase of Lukim Gather is under development.
                  Supporting the collection of conservation and biodiversity
                  data, the Lukim Gather App improves biodiversity and
                  management effectiveness monitoring in PNG protected areas.
                  This innovative mobile technology is helping to overcome many
                  of the geographical, infrastructural, and technological
                  challenges that prevent the effective tracking and management
                  of natural resources within the region.
                </p>
                <p className='font-inter font-[400] text-[16px] leading-[24px] text-color-text mt-[30px] mb-[25px] sm:text-[18px] sm:leading-[32px]'>
                  Because it is able to function offline and out of range of
                  phone signal, the Lukim Gather app enables communities in
                  remote protected areas to:
                </p>
                <div className='flex flex-col gap-[10px]'>
                  <InfoCard
                    img={circle}
                    text='Collect and share social and environmental information, even without internet connections'
                  />
                  <InfoCard
                    img={upload}
                    text='Make automatic data uploads to reduce errors in data collection'
                  />
                  <InfoCard
                    img={flag}
                    text='Quickly and anonymously report on local environmental incidents, including illicit activities such as illegal logging.'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='px-[5vw] py-[50px] lg:py-[0] lg:absolute lg:-bottom-[136px] lg:left-0 lg:right-0'>
            <h2 className='font-sans font-[700] text-[32px] text-color-blue leading-[42px] mb-[64px]'>
              The app is designed to serve
            </h2>
            <div className='flex flex-row flex-wrap justify-center gap-[50px] lg:flex-nowrap'>
              <Card img={members} text='Local community members' />
              <Card
                img={membersAlt}
                text='Community members of protected areas'
              />
              <Card img={civilSociety} text='Civil society organizations ' />
            </div>
          </div>
        </div>
      </div>
      <div className='max-w-[1440px] mx-auto px-[5vw] pt-[80px] lg:pt-[200px]'>
        <div>
          <p className='max-w-[930px] mx-auto font-inter font-[400] text-[16px] leading-[24px] text-color-text sm:text-[18px] sm:leading-[32px]'>
            It enables local communities to report both threats and perceived
            benefits and values that occur within and around protected areas. It
            does this by empowering users to collect and share local data,
            ensuring that Papua New Guinea’s rich biodiversity is afforded
            greater protection from the negative impacts of climate change and
            other environmental threats.
          </p>
          <div className='lg:h-[420px] flex flex-col lg:flex-row items-center bg-color-blue rounded-3xl px-[5%] mt-[104px] pt-[50px] lg:pt-[0] gap-[40px] lg:gap-[20px]'>
            <div className='lg:w-[50%] flex flex-col gap-[20px]'>
              <h2 className='max-w-[320px] font-sans font-[700] text-[36px] leading-[44px] text-color-green sm:text-[48px] sm:leading-[52px]'>
                Want to keep updated?
              </h2>
              <p className='font-inter font-[400] text-[16px] leading-[24px] text-color-white sm:text-[18px] sm:leading-[32px]'>
                Sign up for updates on Lukim Gather
              </p>
              <div className='flex flex-col sm:flex-row gap-[20px] sm:gap-[0] mt-[10px] rounded-xl'>
                <input
                  type='email'
                  value={email}
                  placeholder='Email Address'
                  onChange={handleChange}
                  className='h-[50px] pl-[20px] pr-[5px] font-inter rounded-l-xl rounded-r-xl sm:rounded-r-none'
                />
                <button
                  type='button'
                  className='h-[50px] px-[25px] bg-color-green text-color-white font-inter rounded-r-xl rounded-l-xl sm:rounded-l-none'
                >
                  Sign up
                </button>
              </div>
            </div>
            <div className='lg:w-[50%] flex justify-center'>
              <img src={mobile} alt='' className='max-h-[420px]' />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Home;
