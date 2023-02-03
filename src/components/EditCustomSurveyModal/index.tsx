import React, {useEffect, useRef} from 'react';
import {XMLBuilder, XMLParser} from 'fast-xml-parser';
import {useMutation} from '@apollo/client';

import useToast from '@hooks/useToast';
import {UPDATE_SURVEY} from '@services/queries';

import Modal from '@components/Modal';

import classes from './styles';

interface Props {
  onClose: () => void;
  formData: any;
  formObj: any;
}

interface IframeElement extends HTMLIFrameElement {
  contentWindow: any;
}

const EditCustomSurvey: React.FC<Props> = ({onClose, formData, formObj}) => {
  const toast = useToast();

  const [updateSurvey] = useMutation(UPDATE_SURVEY, {
    onCompleted: () => {
      toast('success', 'Survey has been updated successfully!');
      onClose();
    },
    onError: () => {
      toast('error', 'Error updating survey');
    },
  });

  const iframeRef = useRef<IframeElement>(null);

  useEffect(() => {
    let {model} = formObj.xform;
    const {form} = formObj.xform;

    if (formData?.answer) {
      const builder = new XMLBuilder({
        attributeNamePrefix: '_',
      });
      const xmlContent = builder.build(JSON.parse(formData.answer));
      model = model.replace(/<data(.*?)<\/data>/, xmlContent);
    }

    if (iframeRef && iframeRef.current) {
      // eslint-disable-next-line no-underscore-dangle
      iframeRef.current.contentWindow._modelStr = model;
      // eslint-disable-next-line no-underscore-dangle
      iframeRef.current.contentWindow._formStr = form;
      // iframeRef.current.src = '/xforms';
    }
  }, [formData.answer, formObj.xform]);

  useEffect(() => {
    const STORE = {
      data: '',
      media: '',
    };

    const handleMessage = (event: MessageEvent) => {
      const {data} = event;
      if (typeof (data) === 'string') {
        if (data.startsWith('data://')) {
          STORE.data = data.substring(7);
        } else if (data.startsWith('media://')) {
          if (data?.length > 8) {
            STORE.media = data.substring(8);
          }
        } else if (data.startsWith('data:image/')) {
        // TODO: handle later
        } else if (data === 'submit') {
          const parser = new XMLParser({
            attributeNamePrefix: '_',
          });
          updateSurvey({
            variables: {
              id: formData.id,
              answer: JSON.stringify(parser.parse(STORE.data)),
            },
          });
        }
      }
    };

    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [onClose, updateSurvey, formData.id]);

  return (
    <Modal
      isVisible
      title='Edit Custom Survey'
      className={classes.modal}
      onClose={onClose}
      actions={[]}
    >
      <iframe className={classes.iframe} ref={iframeRef} src={`/xforms?xform=${formData.id}`} title='Edit Custom Survey' />
    </Modal>
  );
};

export default EditCustomSurvey;
