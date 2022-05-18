import React, {useCallback, useEffect, useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import {HiOutlineX} from 'react-icons/hi';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';
import useCategoryIcon from '@hooks/useCategoryIcon';

import Button from '@components/Button';
import Map from '@components/Map';
import {SurveyDataType} from '@components/SurveyTable';
import {GET_SURVEY_DATA} from '@containers/Surveys';

import tree from '@images/category-tree.png';

import classes from './styles';

interface Props {
  data: SurveyDataType;
  setShowDetails(value: boolean): void;
}

const Title = ({text}: {text: string}) => (
  <div className={classes.titleWrapper}>
    <h3 className={classes.titleText}>{text}</h3>
  </div>
);

const Feel = ({sentiment}: {sentiment: string}) => (
  <div className={classes.feelWrapper}>
    <p className={classes.feel}>{sentiment}</p>
  </div>
);

const UPDATE_SURVEY_STATUS = gql`
  mutation UpdateHappeningSurvey(
    $data: UpdateHappeningSurveyInput!
    $id: UUID!
  ) {
    updateHappeningSurvey(data: $data, id: $id) {
      ok
      result {
        status
      }
      errors
    }
  }
`;

const SurveyEntry: React.FC<Props> = ({data, setShowDetails}) => {
  const [updateHappeningSurvey] = useMutation(UPDATE_SURVEY_STATUS, {
    refetchQueries: [GET_SURVEY_DATA, 'happeningSurveys'],
  });
  const [categoryIcon] = useCategoryIcon(data?.category?.id);
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('');

  const getLocationName = useCallback(async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${
        data?.location?.coordinates[0] || 0
      },${data?.location?.coordinates[1] || 0}.json?types=place&access_token=${
        process.env.REACT_APP_MAPBOX_TOKEN
      }`,
    );
    const resData: {
      features: [{place_name?: string}];
    } = await response.json();
    if (resData.features[0]?.place_name) {
      setLocationName(resData.features[0].place_name);
    }
  }, [data?.location?.coordinates]);

  useEffect(() => {
    getLocationName();
  }, [getLocationName]);

  const escapeListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showDeclineModal) {
          setShowDeclineModal(false);
        } else {
          setShowDetails(false);
        }
      }
    },
    [setShowDetails, showDeclineModal],
  );

  useEffect(() => {
    document.addEventListener('keydown', escapeListener);

    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, [escapeListener]);

  const handleShowDeclineModal = useCallback(() => {
    setShowDeclineModal(true);
  }, []);

  const handleHideDeclineModal = useCallback(() => {
    setShowDeclineModal(false);
  }, []);

  const hideDetails = useCallback(() => {
    setShowDetails(false);
  }, [setShowDetails]);

  const handleAccept = useCallback(async () => {
    await updateHappeningSurvey({
      variables: {data: {status: 'APPROVED'}, id: data.id},
    });
    setShowDetails(false);
  }, [data.id, setShowDetails, updateHappeningSurvey]);

  const handleDecline = useCallback(async () => {
    await updateHappeningSurvey({
      variables: {data: {status: 'REJECTED'}, id: data.id},
    });
    setShowDeclineModal(false);
    setShowDetails(false);
  }, [data.id, setShowDetails, updateHappeningSurvey]);

  return (
    <div>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsModal}>
          <div className={classes.iconWrapper} onClick={hideDetails}>
            <HiOutlineX size={14} />
          </div>
          <div className={classes.header}>
            <h2 className={classes.headerTitle}>{data?.title}</h2>
            <p
              className={cs(
                classes.status,
                [classes.pending, data.status.toLowerCase() === 'pending'],
                [classes.rejected, data.status.toLowerCase() === 'rejected'],
                [classes.approved, data.status.toLowerCase() === 'approved'],
              )}
            >
              {data.status}
            </p>
          </div>
          <p className={classes.date}>{formatDate(data.createdAt)}</p>
          <Title text='category' />
          <div className={classes.categoryWrapper}>
            <img
              src={categoryIcon || tree}
              alt='category'
              className={classes.categoryImg}
            />
            <p className={classes.categoryTitle}>{data.category.title}</p>
          </div>
          <Title text='photos' />
          <div className={classes.photosWrapper}>
            {data.attachment.length
              ? data.attachment.map((item: {media: string}) => (
                <img
                  key={item.media}
                  src={item.media}
                  alt=''
                  className={classes.photo}
                />
              ))
              : 'No Photos Found'}
          </div>
          <Title text='feels' />
          <div>
            <Feel sentiment={data.sentiment || '-'} />
          </div>
          <Title text='Description' />
          <div>
            <p className={classes.info}>
              {data.description || 'No Description Found'}
            </p>
          </div>
          <Title text='Location' />
          <div>
            <p className={classes.info}>{locationName || ''}</p>
          </div>
          <div className={classes.mapWrapper}>
            <Map
              center={data?.location?.coordinates || [147.28, -9.5]}
              polygonCoordinates={data?.boundary?.coordinates}
            />
          </div>
          <div className={classes.buttons}>
            <Button
              text='Accept'
              className={classes.acceptBtn}
              onClick={handleAccept}
            />
            <Button
              text='Decline'
              className={classes.declineBtn}
              textClassName={classes.declineBtnText}
              onClick={handleShowDeclineModal}
            />
          </div>
        </div>
      </div>
      <div
        className={cs(classes.declineModalOverlay, [
          'hidden',
          !showDeclineModal,
        ])}
      >
        <div className={classes.declineModal}>
          <div className={classes.declineHeader}>
            <p className={classes.declineHeaderText}>
              Are you sure you want to decline the entry?
            </p>
            <div className={classes.closeIcon} onClick={handleHideDeclineModal}>
              <HiOutlineX size={14} />
            </div>
          </div>
          <div className={classes.declineContent}>
            <p className={classes.declineText}>
              Reasons why it is declined (optional)
            </p>
            <textarea className={classes.textarea} />
            <div className={classes.declineButtons}>
              <Button
                text='Cancel'
                onClick={handleHideDeclineModal}
                className={classes.cancelBtn}
                textClassName={classes.cancelBtnText}
              />
              <Button
                text='Yes, decline'
                onClick={handleDecline}
                className={classes.yesDeclineBtn}
                textClassName={classes.yesDeclineBtnText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyEntry;
