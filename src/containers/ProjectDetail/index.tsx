import React, {useCallback, useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {
  gql, useMutation, useQuery, useLazyQuery,
} from '@apollo/client';
import parse from 'html-react-parser';
import useToast from '@hooks/useToast';

import DashboardHeader from '@components/DashboardHeader';
import Button from '@components/Button';
import Modal, {ActionType} from '@components/Modal';

import {formatName} from '@utils/formatName';

import List from '@ra/components/List';
import MultiSelectInput from '@ra/components/Form/MultiSelectInput';
import projectPlaceholder from '@images/project-placeholder.svg';

import {FiTrash2} from 'react-icons/fi';

import classes from './styles';

const GET_PROJECT = gql`
query Project ($id: ID) {
    projects(id: $id) {
      id
      title
      description
      totalUsers
      createdAt
      isAdmin
      users {
        id
        firstName
        lastName
      }
      organization {
        title
        logo
      }
      surveyCount
      surveyLastModified
    }
  }
`;

const DELETE_PROJECT_USER = gql`
mutation Project ($userId: ID!, $projectId: ID!) {
    deleteProjectUser(userId: $userId, projectId: $projectId) {
        errors
      }
}
`;

const ADD_PROJECT_USERS = gql`
mutation AddProjectUser($input: AddProjectUserMutationInput!) {
    addProjectUser(input: $input) {
        errors {
            messages
            }
        }
}
`;

const GET_USERS = gql`
 query Users($search: String!) {
  users(search: $search) {
    id
    firstName
    lastName
  }
}
`;

interface UserType {
  id: number;
  firstName: string;
  lastName: string;
}

interface UserProps {
  item: UserType;
  onDelete: () => void;
  projectId: string;
}

const UserKeyExtractor = (user: UserType) => user.id;

const UserItem: React.FC<UserProps> = ({item, projectId, onDelete}) => {
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  const nameInitial = item.firstName?.[0]?.toUpperCase() || 'A';
  const toast = useToast();

  const [deleteUser, {loading}] = useMutation(DELETE_PROJECT_USER, {
    onCompleted: () => {
      toast('success', 'User successfully deleted !!');
      onDelete();
    },
    onError: ({graphQLErrors}) => {
      toast('error', graphQLErrors[0]?.message || 'Something went wrong!!');
    },
  });

  const hideDeleteModal = useCallback(() => {
    setShowDeleteUserModal(false);
  }, []);

  const onClickDeleteUser = useCallback(() => {
    setShowDeleteUserModal(true);
  }, []);

  const handleDeleteUser = useCallback(() => {
    deleteUser({
      variables: {
        userId: String(item.id),
        projectId: String(projectId),
      },
    });
  }, [deleteUser, item.id, projectId]);

  return (
    <>
      <div className={classes.userItem}>
        <span className={classes.nameInitial}>{nameInitial}</span>
        <span>{formatName(item)}</span>
        {!loading
        && (
          <div onClick={onClickDeleteUser} className={classes.deleteIcon}>
            <FiTrash2 size='1.1em' color='#70747E' />
          </div>
        )}
      </div>
      <Modal
        isVisible={showDeleteUserModal}
        title='Remove user?'
        onClose={hideDeleteModal}
        actions={[
          {label: 'Cancel', onClick: hideDeleteModal, type: ActionType.Neutral},
          {label: 'Yes, delete', onClick: handleDeleteUser, type: ActionType.Danger},
        ]}
      >
        <div>
          Are you sure you want to remove
          {' '}
          {formatName(item)}
          {' '}
          from project?
        </div>
      </Modal>
    </>
  );
};

const ProjectDetails = () => {
  const [userSearchInput, setUserSearchInput] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const {id} = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {data, loading, refetch} = useQuery(GET_PROJECT, {
    variables: {id: String(id)},
  });

  const [loadUsers, {data: users, loading: loadingUsers}] = useLazyQuery(GET_USERS, {
    variables: {search: userSearchInput},
  });

  const [addUsers] = useMutation(ADD_PROJECT_USERS, {
    onCompleted: () => {
      toast('success', 'Users successfully added !!');
    },
    onError: ({graphQLErrors}) => {
      toast('error', graphQLErrors[0]?.message || 'Something went wrong');
    },
  });

  const handleUserInputChange = useCallback((input) => {
    setUserSearchInput(input);
    loadUsers({
      variables: {search: input},
    });
  }, [loadUsers]);

  const onClickAddUser = useCallback(() => {
    setShowAddUserModal(true);
  }, []);

  const onClickViewSurveys = useCallback(() => {
    navigate('/surveys', {state: {project: {id, title: data?.projects[0]?.title}}});
  }, [id, navigate, data?.projects]);

  const handleSelectedUsersChange = useCallback(({value}) => {
    setSelectedUsers(value);
  }, [setSelectedUsers]);

  const handleAddUsers = useCallback(async () => {
    setShowAddUserModal(false);
    await addUsers({
      variables: {
        input: {
          id: Number(id),
          users: selectedUsers.map((user: any) => String(user.id)),
        },
      },
    });
    refetch();
  }, [selectedUsers, addUsers, id, setShowAddUserModal, refetch]);

  const onCloseModal = useCallback(() => {
    setUserSearchInput('');
    setShowAddUserModal(false);
    setSelectedUsers([]);
  }, [setUserSearchInput, setShowAddUserModal]);

  const renderUserLabel = useCallback(({item}) => `${item?.firstName} ${item?.lastName}`, []);

  return (
    <>
      <DashboardHeader title='Project detail' />
      <section className={classes.section}>
        <Link to='/projects' className={classes.backWrapper}>
          <span className='material-symbols-rounded text-[#101828]'>
            arrow_back
          </span>
          <p className={classes.backTitle}>Back to projects</p>
        </Link>
        {loading ? 'Loading ...' : (
          <div className={classes.content}>
            <div className={classes.itemContainer}>
              <div className={classes.itemHeader}>
                <div className='divide-dashed'>
                  <h2 className={classes.title}>{data?.projects[0]?.title || 'N/A'}</h2>
                </div>
                <Button text='View Surveys' className={classes.secondaryButton} textClassName={classes.secondaryButtonText} onClick={onClickViewSurveys} />
              </div>
              <p className={classes.description}>
                {parse(data?.projects[0]?.description || 'N/A')}
              </p>
              <div className={classes.infoWrapper}>
                <div className={classes.info}>
                  <h5 className={classes.infoHeading}>DATE CREATED</h5>
                  <p className={classes.infoData}>
                    {
                      new Date(data?.projects[0]?.createdAt)?.toLocaleDateString(undefined, {
                        month: 'short', day: '2-digit', year: 'numeric',
                      })
                    }
                  </p>
                </div>
                <hr className={classes.separator} />
                <div className={classes.info}>
                  <h5 className={classes.infoHeading}>NUMBER OF MEMBERS</h5>
                  <p className={classes.infoData}>{data?.projects[0]?.totalUsers}</p>
                </div>
                <hr className={classes.separator} />
                <div className={classes.info}>
                  <h5 className={classes.infoHeading}>No. of surveys</h5>
                  <p className={classes.infoData}>{data?.projects[0]?.surveyCount}</p>
                </div>
                <hr className={classes.separator} />
                <div className={classes.info}>
                  <h5 className={classes.infoHeading}>Last Updated</h5>
                  <p className={classes.infoData}>
                    {
                      data?.projects[0]?.surveyLastModified
                        ? new Date(data?.projects[0]?.surveyLastModified)
                          ?.toLocaleDateString(undefined, {
                            month: 'short', day: '2-digit', year: 'numeric',
                          }) : 'N/A'
                    }
                  </p>
                </div>
              </div>
              {data?.projects[0]?.organization
              && (
                <div className={classes.orgContainer}>
                  <div className={classes.orgHeader}>
                    Organization
                  </div>
                  <div className={classes.orgContent}>
                    <img className={classes.orgLogo} alt='organization-logo' src={data?.projects[0]?.organization?.logo || projectPlaceholder} />
                    <p className={classes.orgName}>{data?.projects[0]?.organization?.title}</p>
                  </div>
                </div>
              )}
            </div>
            {data?.projects[0].isAdmin && (
              <div className={classes.userContainer}>
                <div className={classes.userHeaderContainer}>
                  <h3 className={classes.userHeader}>Users</h3>
                  <Button text='+ Add' className={classes.secondaryButton} textClassName={classes.secondaryButtonText} onClick={onClickAddUser} />
                </div>
                <List
                  className={classes.userList}
                  data={data?.projects[0]?.users}
                  renderItem={UserItem}
                  keyExtractor={UserKeyExtractor}
                  onDelete={refetch}
                  projectId={id}
                />
              </div>
            )}
          </div>
        )}
      </section>
      <Modal
        title='Add users'
        isVisible={showAddUserModal}
        onClose={onCloseModal}
        actions={[
          {label: 'Cancel', onClick: onCloseModal, type: ActionType.Neutral},
          {label: 'Add', onClick: handleAddUsers, type: ActionType.Primary},
        ]}
      >
        <div className={classes.modalContent}>
          <MultiSelectInput
            loading={loadingUsers}
            controlClassName={classes.multiSelect}
            placeholder='Enter at least 3 letters to search..'
            onInputChange={handleUserInputChange}
            options={userSearchInput.length > 2 ? users?.users : []}
            onChange={handleSelectedUsersChange}
            renderOptionLabel={renderUserLabel}
            renderControlLabel={renderUserLabel}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProjectDetails;
