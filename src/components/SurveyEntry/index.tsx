import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  gql, useMutation,
} from '@apollo/client';
import {
  HiOutlineX, HiTrendingDown, HiTrendingUp, HiMenuAlt4,
} from 'react-icons/hi';

import cs from '@utils/cs';
import useToast from '@hooks/useToast';

import Button from '@components/Button';
import {SurveyDataType} from '@components/SurveyTable';
import {GET_SURVEY_DATA} from '@containers/Surveys';

import SurveyDetails from './SurveyDetails';

import classes from './styles';

interface Props {
  data: SurveyDataType;
  setShowDetails(value: boolean): void;
  onEditClick: (updateMode?: boolean) => void;
  allowEdit: boolean;
}

export const Improvement = ({
  improvement,
  iconColor = '#EC6D25',
}: {improvement: string | null; iconColor?: string}) => {
  const status = improvement?.toLowerCase();

  const renderImprovementIcon = useCallback(
    () => {
      switch (status) {
      case 'increasing':
        return <HiTrendingUp size={25} color={iconColor} />;
      case 'decreasing':
        return <HiTrendingDown size={25} color={iconColor} />;
      case 'same':
        return <HiMenuAlt4 size={25} color={iconColor} />;
      default:
        return <p className='ml-2'>-</p>;
      }
    },
    [iconColor, status],
  );

  return (
    <>
      {renderImprovementIcon()}
    </>
  );
};

const UPDATE_SURVEY_STATUS = gql`
  mutation EditHappeningSurvey(
    $data: UpdateHappeningSurveyInput!
    $id: UUID!
  ) {
    editHappeningSurvey(data: $data, id: $id) {
      ok
      result {
        status
      }
      errors
    }
  }
`;

const SurveyEntry: React.FC<Props> = (
  {
    data,
    setShowDetails,
    allowEdit,
    onEditClick,
  },
) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [updateHappeningSurvey] = useMutation(UPDATE_SURVEY_STATUS, {
    refetchQueries: [GET_SURVEY_DATA, 'happeningSurveys'],
    onError: (err) => {
      toast('error', String(err));
    },
  });
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);

  const escapeListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showDeclineModal) {
          setShowDeclineModal(false);
        } else {
          setShowDetails(false);
          navigate('/surveys');
        }
      }
    },
    [navigate, setShowDetails, showDeclineModal],
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
    navigate('/surveys');
  }, [navigate, setShowDetails]);

  const handleAccept = useCallback(async () => {
    await updateHappeningSurvey({
      variables: {data: {status: 'APPROVED'}, id: data?.id},
    });
    setShowDetails(false);
  }, [data?.id, setShowDetails, updateHappeningSurvey]);

  const handleDecline = useCallback(async () => {
    await updateHappeningSurvey({
      variables: {data: {status: 'REJECTED'}, id: data?.id},
    });
    setShowDeclineModal(false);
    setShowDetails(false);
  }, [data?.id, setShowDetails, updateHappeningSurvey]);

  const handleEditButtonClick = useCallback(() => onEditClick?.(), [onEditClick]);
  const handleUpdateButtonClick = useCallback(() => onEditClick?.(true), [onEditClick]);

  return (
    <div>
      <div className={classes.detailsContainer}>
        <SurveyDetails
          className={classes.detailsModal}
          data={data}
          isEditable={allowEdit}
          onEdit={handleEditButtonClick}
          onUpdate={handleUpdateButtonClick}
          onAcceptSurvey={handleAccept}
          onDeclineSurvey={handleShowDeclineModal}
          onClose={hideDetails}
        />
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
    </div>
  );
};

export default SurveyEntry;
