import React, {useEffect, useRef} from 'react';
import {XMLBuilder, XMLParser} from 'fast-xml-parser';

import Modal from '@components/Modal';

import classes from './styles';

interface Props {
  onClose: () => void;
  formData: any;
  formObj: any;
  handleSubmit: (formData: any) => void;
  title: string;
}

interface IframeElement extends HTMLIFrameElement {
  contentWindow: any;
}

const EditCustomSurvey: React.FC<Props> = ({
  title, onClose, formData, formObj, handleSubmit,
}) => {
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
          handleSubmit(JSON.stringify(parser.parse(STORE.data)));
        }
      }
    };

    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [onClose, handleSubmit, formData.id]);

  return (
    <Modal
      isVisible
      title={title}
      className={classes.modal}
      onClose={onClose}
      actions={[]}
    >
      <iframe className={classes.iframe} ref={iframeRef} src={`/xforms?xform=${formData.id}`} title='Edit Custom Survey' />
    </Modal>
  );
};

export default EditCustomSurvey;
