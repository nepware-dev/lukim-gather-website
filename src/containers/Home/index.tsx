import React from 'react';

import cs from '@utils/cs';
import AppButton from '@components/AppButton';
import InfoCard from '@components/InfoCard';
import Card from '@components/Card';

import HeroImage from '@images/lukim-hero.webp';
import circle from '@images/circle.svg';
import upload from '@images/upload.svg';
import flag from '@images/flag.svg';
import members from '@images/members.png';
import civilSociety from '@images/civil-society.png';
import membersAlt from '@images/members-alt.png';

import classes from './styles';

const Home = () => (
  <div>
    <section className={classes.heroSection}>
      <div className={classes.heroContent}>
        <h1 className={classes.heroTitle}>
          The Lukim Gather Mobile Data Application
        </h1>
        <p className={classes.heroText}>
          How do we ensure that community data from Papua New Guinea’s
          protected areas is reported and heard?
        </p>
        <div className={classes.heroButtons}>
          <a href='https://apps.apple.com/np/app/lukim-gather/id6443612199' target='_blank' rel='noreferrer'>
            <AppButton boxShadow available beta />
          </a>
          <a href='https://play.google.com/store/apps/details?id=org.lukimgather' target='_blank' rel='noreferrer'>
            <AppButton android boxShadow available beta />
          </a>
        </div>
      </div>
      <div className={classes.heroImageWrapper}>
        <img
          src={HeroImage}
          alt='lukim-mobile-app'
          className={classes.heroImage}
        />
      </div>
    </section>
    <section>
      <h2 className={classes.backgroundTitle}>
        Background
      </h2>
      <div className={classes.bgContentWrapper}>
        <div className='h-[200px] w-[100%] sm:h-[350px] md:h-[300px] md:w-[70%] lg:h-[315px] lg:w-[560px]'>
          <iframe
            width='100%'
            height='100%'
            src='https://www.youtube.com/embed/IZMr4o7KJhc'
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
        <div className={classes.bgContent}>
          <p className={classes.bgInfo}>
            As part of the UNDP
            <a
              href='http://www.png-nrmhub.org/'
              target='_blank'
              rel='noreferrer'
            >
              <span className={classes.highlightText}>
                {' '}
                Papua New Guinea’s Natural Resource Hub
              </span>
            </a>
            , the second phase of Lukim Gather is under development.
            Supporting the collection of conservation and biodiversity
            data, the Lukim Gather App improves biodiversity and management
            effectiveness monitoring in PNG protected areas. This
            innovative mobile technology is helping to overcome many of
            the geographical, infrastructural, and technological challenges
            that prevent the effective tracking and management of natural
            resources within the region.
          </p>
          <p className={cs(classes.bgInfo, 'mt-[30px] mb-[25px]')}>
            Because it is able to function offline and out of range of
            phone signal, the Lukim Gather app enables communities in
            remote protected areas to:
          </p>
          <div className={classes.bgCards}>
            <InfoCard
              img={circle}
              text='Collect and share social and environmental information, even without internet connections'
            />
            <InfoCard
              img={upload}
              text='Make automatic data uploads via a centralized server which can save time and reduce errors in data collection'
            />
            <InfoCard
              img={flag}
              text='Quickly and anonymously report on local environmental incidents, including illicit activities such as illegal logging'
            />
          </div>
        </div>
      </div>
    </section>
    <div className={classes.appInfoWrapper}>
      <h2 className={classes.appInfoTitle}>
        The app is designed to serve
      </h2>
      <div className={classes.appInfoCards}>
        <Card img={members} text='Local community members' />
        <Card img={membersAlt} text='Community members of protected areas' />
        <Card img={civilSociety} text='Civil society organizations' />
      </div>
    </div>
  </div>
);

export default Home;
