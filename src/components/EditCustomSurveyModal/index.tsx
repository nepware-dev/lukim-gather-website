import React, {useEffect, useRef} from 'react';
import {XMLBuilder, XMLParser} from 'fast-xml-parser';
import {useMutation} from '@apollo/client';

import Modal from '@components/Modal';

import {UPLOAD_MEDIA} from '@services/queries';
import useToast from '@hooks/useToast';

import {b64toBlob} from '@utils/blob';

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

const STORE = {
  data: '',
  media: '',
};

const EditCustomSurvey: React.FC<Props> = ({
  title, onClose, formData, formObj, handleSubmit,
}) => {
  const iframeRef = useRef<IframeElement>(null);
  const toast = useToast();

  const [uploadMedia] = useMutation(UPLOAD_MEDIA, {
    onCompleted: ({uploadMedia}) => {
      STORE.data = STORE.data.replace(uploadMedia.result.title, uploadMedia.result.media);
    },
    onError: ({graphQLErrors}) => {
      toast('error', graphQLErrors[0]?.message || 'Something went wrong, Please enter valid credentials');
    },
  });

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
    const queue: Promise<any>[] = [];

    // reset store
    STORE.data = '';
    STORE.media = '';

    const handleMessage = async (event: MessageEvent) => {
      const {data} = event;
      if (typeof (data) === 'string') {
        if (data.startsWith('data://')) {
          STORE.data = data.substring(7);
        } else if (data.startsWith('media://')) {
          if (data?.length > 8) {
            STORE.media = data.substring(8);
          }
        } else if (data.startsWith('data:image')) {
          const imageParts = data.split(';');
          const name = imageParts.pop() as string;
          const imgBlob = await b64toBlob(imageParts.join(';'));
          queue.push(uploadMedia({
            variables: {
              media: new File([imgBlob], name, {type: imageParts[0].split(':')[1]}),
              title: name,
              type: 'image',
            },
          }));
        } else if (data === 'submit') {
          await Promise.all(queue);
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
  }, [onClose, handleSubmit, formData.id, uploadMedia]);

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
