import React, {useEffect, useRef, useState} from 'react';
import {XMLBuilder, XMLParser} from 'fast-xml-parser';
import {useMutation} from '@apollo/client';

import Modal from '@components/Modal';
import Loader from '@components/Loader';

import {UPLOAD_MEDIA} from '@services/queries';
import useToast from '@hooks/useToast';

import cs from '@ra/cs';
import {b64toBlob} from '@utils/blob';
import {formatFormAnswers} from '@utils/formatAnswers';

import classes from './styles';

interface Props {
  onClose: () => void;
  formData: any;
  formObj: any;
  handleSubmit: (formData: any, sortedFormData: any) => void;
  title: string;
  loading: boolean;
  projects: Array<any>;
}

interface IframeElement extends HTMLIFrameElement {
  contentWindow: any;
}

const STORE = {
  data: '',
  media: '',
};

const EditCustomSurvey: React.FC<Props> = ({
  title, onClose, formData, formObj, handleSubmit, loading, projects,
}) => {
  const iframeRef = useRef<IframeElement>(null);
  const toast = useToast();

  const [uploadMedia, {loading: uploadingMedia}] = useMutation(UPLOAD_MEDIA, {
    onError: ({graphQLErrors}) => {
      toast('error', graphQLErrors[0]?.message || 'Something went wrong, Please enter valid credentials');
    },
  });

  useEffect(() => {
    let {model} = formObj.xform;
    let {form} = formObj.xform;

    if (formData?.answer) {
      const builder = new XMLBuilder({
        attributeNamePrefix: '_',
      });
      const xmlContent = builder.build({data: formatFormAnswers(formData)});
      model = model.replace(/<data(.*?)<\/data>/, xmlContent);
    }
    const projectsXML = projects.reduce((a, c) => `${a}<option value="${c.title}">${c.title}</option>`, '');
    form = form.replace(/(<select name=.*project_name.*None<\/option>)(.*?)(<\/select>)/, `$1${projectsXML}$3`);

    if (iframeRef && iframeRef.current) {
      // eslint-disable-next-line no-underscore-dangle
      iframeRef.current.contentWindow._modelStr = model;
      // eslint-disable-next-line no-underscore-dangle
      iframeRef.current.contentWindow._formStr = form;
      // iframeRef.current.src = '/xforms';
    }
  }, [formData, formObj.xform, projects]);

  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    const queue: {name: string; upload: Promise<any>}[] = [];

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
          if (!queue.some((q) => q.name === name)) {
            queue.push({
              name,
              upload: uploadMedia({
                variables: {
                  media: new File([imgBlob], name, {type: imageParts[0].split(':')[1]}),
                  title: name,
                  type: 'image',
                },
              }),
            });
          }
        } else if (data === 'submit' && !processing && STORE.data?.trim?.()?.length > 0) {
          setProcessing(true);
          try {
            const uploadResults = await Promise.all(queue.map((q) => q.upload));
            uploadResults.forEach((uploadResult) => {
              const result = uploadResult?.data?.uploadMedia?.result;
              if (result?.title && result?.media) {
                STORE.data = STORE.data.replace(new RegExp(result.title, 'g'), result.media);
              }
            });
            const parser = new XMLParser({
              attributeNamePrefix: '_',
              preserveOrder: true,
            });
            const formAnswersArrayJSON = JSON.stringify(parser.parse(STORE.data));
            const formAnswersObject = formatFormAnswers({answer: formAnswersArrayJSON});
            await handleSubmit(
              JSON.stringify({data: formAnswersObject}),
              formAnswersArrayJSON,
            );
            setProcessing(false);
            // reset store
            STORE.data = '';
            STORE.media = '';
          } catch (err) {
            setProcessing(false);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [onClose, handleSubmit, formData.id, uploadMedia, processing]);

  return (
    <Modal
      isVisible
      title={title}
      className={cs(classes.modal, {
        [classes.modalLoading]: loading || uploadingMedia || processing,
      })}
      onClose={onClose}
      actions={[]}
    >
      <>
        {(loading || uploadingMedia || processing) && <Loader className={classes.loader} />}
        <iframe className={classes.iframe} ref={iframeRef} src={`/xforms?xform=${formData.id}`} title='Edit Custom Survey' />
      </>
    </Modal>
  );
};

export default EditCustomSurvey;
