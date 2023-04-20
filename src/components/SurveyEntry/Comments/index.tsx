import React, {useCallback, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {formatDistanceToNowStrict} from 'date-fns';
import {BsHeart, BsHeartFill, BsThreeDots} from 'react-icons/bs';
import {useMutation} from '@apollo/client';

import CommentInput from '@components/CommentInput';
import Dropdown from '@components/Dropdown';
import List from '@ra/components/List';
import Modal, {ActionType} from '@components/Modal';

import cs from '@ra/cs';
import {
  CREATE_COMMENT, DELETE_COMMENT, DISLIKE_COMMENT, LIKE_COMMENT, UPDATE_COMMENT,
} from '@services/queries';
import useToast from '@hooks/useToast';

import UserPlaceholder from '@images/user-placeholder.webp';
import type {rootState} from '@store/rootReducer';

import classes from './styles';

const idExtractor = (item: {id: string | number, [key: string]: any}) => item.id;

interface CommentsProps {
  surveyId?: number | string;
  commentsData: any[];
  refetch: (surveyId: string | number) => void;
  readOnly?: boolean;
}

const NoComments: React.FC = () => <p className={classes.emptyMessage}>No comments found!</p>;

interface CommentItemProps {
  item: any;
  isReply?: boolean;
  onLike: (commentItem: any) => void;
  onReply?: (commentText: string, parentId: string | number) => void;
  onEdit: (commentText: string, commentId: string | number) => void;
  onDelete: (commentId: string | number) => void;
  readOnly?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  item,
  isReply,
  onLike,
  onReply,
  onEdit,
  onDelete,
  readOnly,
}) => {
  const {user} = useSelector((state: rootState) => state.auth);

  const [showAllReplies, setShowAllReplies] = useState<boolean>(false);
  const handleShowAllReplies = useCallback(() => {
    setShowAllReplies(true);
  }, []);

  const [isReplyMode, setReplyMode] = useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);

  const fullName = useMemo(() => {
    if (item?.user?.firstName) {
      return `${item.user.firstName} ${item.user.lastName || ''}`;
    }
    return 'User';
  }, [item]);

  const handleLikeClick = useCallback(() => {
    onLike(item);
  }, [item, onLike]);

  const handleReplyClick = useCallback(() => {
    setReplyMode(true);
  }, []);
  const handleReplyCancel = useCallback(() => {
    setReplyMode(false);
  }, []);
  const handleReplySubmit = useCallback((commentText: string) => {
    onReply?.(commentText, item.id);
    setReplyMode(false);
  }, [onReply, item]);

  const handleEditClick = useCallback(() => {
    setEditMode(true);
  }, []);
  const handleEditCancel = useCallback(() => {
    setEditMode(false);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setDeleteVisible(true);
  }, []);
  const handleDeleteCancel = useCallback(() => {
    setDeleteVisible(false);
  }, []);
  const handleDeleteComment = useCallback(() => {
    onDelete(item.id);
    setDeleteVisible(false);
  }, [onDelete, item]);

  const handleEditSubmit = useCallback((commentText: string) => {
    onEdit(commentText, item.id);
    setEditMode(false);
  }, [onEdit, item]);

  const renderReplyCommentItem = useCallback((listProps) => (
    <CommentItem
      {...listProps}
      isReply
      onLike={onLike}
      onEdit={onEdit}
      onDelete={onDelete}
      readOnly={readOnly}
    />
  ), [onLike, onEdit, onDelete, readOnly]);

  const renderCommentOptionsIcon = useCallback(() => (
    <div className={classes.commentOptionsIconContainer}>
      <BsThreeDots className={classes.commentOptionsIcon} />
    </div>
  ), []);

  const LikeIcon = useMemo(() => {
    if (item.hasLiked) {
      return BsHeartFill;
    }
    return BsHeart;
  }, [item]);

  const commentDate = useMemo(() => {
    const formattedDistance = formatDistanceToNowStrict(new Date(item.modifiedAt), {
      addSuffix: true,
    });
    if (formattedDistance === 'in 0 seconds') {
      return 'now';
    }
    return formattedDistance;
  }, [item]);

  return (
    <>
      <div className={classes.commentItem}>
        <img className={classes.commentAvatar} src={item.user?.avatar || UserPlaceholder} alt='User avatar' />
        <div className={classes.commentContent}>
          <div className={classes.commentMeta}>
            <p className={classes.commentUser}>
              {fullName}
            </p>
            <p className={classes.commentDate}>
              {commentDate}
              {!item.isDeleted
                && Math.abs(+new Date(item.createdAt) - +new Date(item.modifiedAt)) > 5000
                && (
                  <span> (edited)</span>
                )}
            </p>
          </div>
          {isEditMode ? (
            <CommentInput onCancel={handleEditCancel} onSubmit={handleEditSubmit} placeholder='Edit comment' defaultValue={item.description} />
          ) : (
            <p className={classes.commentDescription}>
              {item.description}
            </p>
          )}
          {!isEditMode ? isReplyMode ? (
            <CommentInput placeholder='Add reply' onCancel={handleReplyCancel} onSubmit={handleReplySubmit} />
          ) : (
            <div className={cs(classes.commentActions, {
              hidden: readOnly,
            })}
            >
              {!item.isDeleted && (
                <LikeIcon
                  size={20}
                  className={classes.likeIcon}
                  onClick={handleLikeClick}
                />
              )}
              {!isReply && (
                <span onClick={handleReplyClick} className={classes.actionLink}>Reply</span>
              )}
              {user && user.id === item.user?.id && (
                <Dropdown renderLabel={renderCommentOptionsIcon} alignRight={isReplyMode}>
                  <div className={classes.commentOptions}>
                    <div className={classes.commentOptionItem} onClick={handleEditClick}>Edit</div>
                    <div className={classes.commentOptionItem} onClick={handleDeleteClick}>
                      Delete
                    </div>
                  </div>
                </Dropdown>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {item.replies && item.replies.length > 0 && (
        <List
          className={cs(classes.commentList, classes.commentListReplies)}
          data={showAllReplies ? item.replies : item.replies.slice(0, 1)}
          keyExtractor={idExtractor}
          renderItem={renderReplyCommentItem}
          FooterComponent={(showAllReplies || item.replies.length <= 1) ? null : (
            <div className={classes.viewMoreLink} onClick={handleShowAllReplies}>
              {item.replies.length - 1 === 1
                ? 'View 1 more reply'
                : `View ${item.replies.length - 1} more reply`}
            </div>
          )}
        />
      )}
      <Modal
        actions={[{
          label: 'Cancel',
          onClick: handleDeleteCancel,
          type: ActionType.Neutral,
        }, {
          label: 'Delete',
          onClick: handleDeleteComment,
          type: ActionType.Danger,
        }]}
        title='Delete comment?'
        isVisible={isDeleteVisible}
        onClose={handleDeleteCancel}
      >
        <p>Are you sure you want to delete your comment?</p>
      </Modal>
    </>
  );
};

const Comments: React.FC<CommentsProps> = ({
  surveyId,
  commentsData,
  refetch,
  readOnly,
}) => {
  const toast = useToast();

  const commentChangeCallback = useCallback(() => {
    refetch(surveyId as number | string);
  }, [refetch, surveyId]);
  const commentErrorCallback = useCallback((err) => {
    toast('error', String(err));
  }, [toast]);

  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: commentChangeCallback,
    onError: commentErrorCallback,
  });
  const handleAddComment = useCallback((commentText: string, parentId?: string | number) => {
    createComment({
      variables: {
        input: {
          objectId: surveyId,
          description: commentText,
          contentType: 'happeningsurvey',
          ...(Boolean(parentId) && {parent: parentId}),
        },
      },
    });
  }, [createComment, surveyId]);

  const [updateComment] = useMutation(UPDATE_COMMENT, {
    onCompleted: commentChangeCallback,
    onError: commentErrorCallback,
  });
  const handleEditComment = useCallback((commentText: string, commentId: string | number) => {
    updateComment({
      variables: {
        input: {
          id: commentId,
          message: commentText,
        },
      },
    });
  }, [updateComment]);

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: commentChangeCallback,
    onError: commentErrorCallback,
  });
  const handleDeleteComment = useCallback((commentId: string | number) => {
    deleteComment({
      variables: {id: commentId},
    });
  }, [deleteComment]);

  const [likeComment] = useMutation(LIKE_COMMENT, {
    onCompleted: commentChangeCallback,
    onError: commentErrorCallback,
  });
  const [dislikeComment] = useMutation(DISLIKE_COMMENT, {
    onCompleted: commentChangeCallback,
    onError: commentErrorCallback,
  });
  const handleLikeDislikeComment = useCallback((comment:any) => {
    if (comment) {
      if (comment.hasLiked) {
        dislikeComment({
          variables: {id: Number(comment.id)},
        });
      } else {
        likeComment({
          variables: {input: {comment: comment.id}},
        });
      }
    }
  }, [likeComment, dislikeComment]);

  // eslint-disable-next-line max-len
  const hasNoComments = useMemo(() => !commentsData?.length || commentsData.length === 0, [commentsData]);

  const renderCommentItem = useCallback((listProps) => (
    <CommentItem
      {...listProps}
      onLike={handleLikeDislikeComment}
      onReply={handleAddComment}
      onEdit={handleEditComment}
      onDelete={handleDeleteComment}
      readOnly={readOnly}
    />
  ), [
    handleLikeDislikeComment,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    readOnly,
  ]);

  return (
    <div className={classes.container}>
      {hasNoComments && <NoComments />}
      {!readOnly && <CommentInput onSubmit={handleAddComment} />}
      {!hasNoComments && (
        <List
          className={classes.commentList}
          data={commentsData}
          keyExtractor={idExtractor}
          renderItem={renderCommentItem}
        />
      )}
    </div>
  );
};

export default Comments;
