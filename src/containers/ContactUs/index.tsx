import React, {useCallback} from 'react';
import {FaFacebookF, FaLinkedinIn, FaTwitter} from 'react-icons/fa';
import {IoMdMail} from 'react-icons/io';
import {IoLocationSharp} from 'react-icons/io5';
import {useMutation} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

import Layout from '@components/Layout';
import Button from '@ra/components/Button';

import TextInput from '@ra/components/Form/TextInput';
import Form, {FormSubmitCallback, InputField} from '@ra/components/Form';

import useToast from '@hooks/useToast';
import {SEND_MESSAGE} from '@services/queries';

import classes from './styles';

const ContactUs = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [sendMessage, {loading}] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      toast('success', 'Successfully message sent!!');
      navigate('/');
    },
    onError: ({graphQLErrors}) => {
      toast('error', graphQLErrors[0]?.message || 'Something went wrong !!');
    },
  });

  const handleSaveDeliverables: FormSubmitCallback = useCallback(async (formData) => {
    await sendMessage({
      variables: {
        input: {
          name: `${formData.firstName} ${formData.firstName}`,
          email: formData.email,
          subject: 'subject',
          message: formData.message,
        },
      },
    });
  }, [sendMessage]);

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.header}>
          <h1 className={classes.heading}>Get in Touch</h1>
          <p className={classes.desc}>Any question or remarks? Just write us a message!</p>
        </div>
        <div className={classes.contentWrapper}>
          <div className={classes.content}>
            <div>
              <h2 className={classes.title}>Contact information</h2>
              <p className={classes.message}>Our friendly team would love to hear from you!</p>
            </div>
            <div className={classes.infoWrapper}>
              <div className={classes.info}>
                <IoMdMail size={32} color='#fff' />
                <a href='mailto:info@png-nrmhub.org' className={classes.mail}>info@png-nrmhub.org</a>
              </div>
              <div className={classes.info}>
                <IoLocationSharp size={32} color='#fff' />
                <p className={classes.mail}>
                  Level 14, Kina Bank Haus
                  N.C.D, Port Moresby
                  Papua New Guinea
                </p>
              </div>
            </div>
            <div className={classes.socialMedia}>
              <a href='https://facebook.com/' target='_blank' rel='noreferrer'>
                <FaFacebookF size={28} color='#fff' />
              </a>
              <a href='https://linkedin.com/' target='_blank' rel='noreferrer'>
                <FaLinkedinIn size={32} color='#fff' />
              </a>
              <a href='https://twitter.com/' target='_blank' rel='noreferrer'>
                <FaTwitter size={32} color='#fff' />
              </a>
            </div>
          </div>
          <Form className={classes.formWrapper} onSubmit={handleSaveDeliverables}>
            <div className={classes.row}>
              <div className={classes.col}>
                <p className={classes.label}>First Name</p>
                <InputField
                  component={TextInput}
                  name='firstName'
                  placeholder='Enter your first name'
                  className={classes.input}
                  required
                />
              </div>
              <div className={classes.col}>
                <p className={classes.label}>Last Name</p>
                <InputField
                  component={TextInput}
                  name='lastName'
                  placeholder='Enter your last name'
                  className={classes.input}
                  required
                />
              </div>
            </div>
            <div className={classes.col}>
              <p className={classes.label}>Email</p>
              <InputField
                component={TextInput}
                name='email'
                type='email'
                placeholder='Enter your email address'
                className={classes.input}
                required
              />
            </div>
            <div className={classes.col}>
              <p className={classes.label}>Message</p>
              <InputField
                component='textarea'
                name='message'
                className={classes.input}
                rows={5}
                placeholder='Enter your message here ...'
                required
              />
            </div>
            <Button disabled={loading} type='submit' className={classes.submitButton}>Submit</Button>
          </Form>
        </div>
      </section>
    </Layout>
  );
};

export default ContactUs;
