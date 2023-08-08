import {gql} from '@apollo/client';

export const GET_ME = gql`
    query GetMe {
        me {
          id
          firstName
          lastName
          email
          organization
          avatar
          isStaff
          phoneNumber
          hasPassword
        }
    }
`;

export const EDIT_HAPPENING_SURVEY = gql`
    mutation EditHappeningSurvey(
        $input: UpdateHappeningSurveyInput!
        $id: UUID!
    ) {
        editHappeningSurvey(data: $input, id: $id) {
            __typename
            errors
            ok
            result {
                id
                title
                description
                sentiment
                improvement
                isTest
                isPublic
            }
        }
    }
`;

export const UPDATE_HAPPENING_SURVEY = gql`
    mutation UpdateHappeningSurvey(
        $input: UpdateHappeningSurveyInput!
        $id: UUID!
    ) {
        updateHappeningSurvey(data: $input, id: $id) {
            __typename
            errors
            ok
            result {
                id
                title
                description
                sentiment
                improvement
                isTest
                isPublic
            }
        }
    }
`;

export const GET_HAPPENING_SURVEY_HISTORY = gql`
    query GetHappeningSurveysHistory($surveyId: String) {
        happeningSurveysHistory(objectId: $surveyId) {
            id
            serializedData {
                fields {
                    modifiedAt
                }
            }
        }
    }
`;

export const GET_HAPPENING_SURVEY_HISTORY_ITEM = gql`
    query GetHappeningSurveysHistoryItem($surveyId: String, $id: ID) {
        happeningSurveysHistory(objectId: $surveyId, id: $id) {
            serializedData {
                fields {
                    title
                    description
                    attachment {
                        id
                        media
                    }
                    audioFile
                    category {
                        id
                        title
                    }
                    boundary {
                        type
                        coordinates
                    }
                    location {
                        type
                        coordinates
                    }
                    region {
                        id
                    }
                    protectedArea {
                        id
                    }
                    improvement
                    sentiment
                    status
                    isTest
                    isPublic
                    createdAt
                    modifiedAt
                    createdBy {
                        id
                        firstName
                        lastName
                    }
                    project {
                        id
                        title
                    }
                }
            }
        }
    }
`;

export const CREATE_SURVEY = gql`
    mutation CreateWritableSurvey($input: WritableSurveyMutationInput!) {
        createWritableSurvey(input: $input) {
            id
            title
            errors {
                field
                messages
            }
        }
    }
`;

export const UPDATE_SURVEY = gql`
    mutation UpdateSurvey($id: ID!, $answer: JSONString!) {
        updateSurvey(id: $id, answer: $answer) {
            result {
              answer
            }
            ok
            errors {
              field
              messages
            }
        }
    }
`;

export const GET_SUPPORT_CATEGORY = gql`
query{
  supportCategory {
    treeId
    parent {
      id
      title
      children {
        title
      }
    }
  }
}
`;

export const PHONE_NUMBER_CHANGE = gql`
    mutation PhoneNumberChange($data: PhoneNumberChangeInput!) {
        phoneNumberChange(data: $data) {
            ok
            errors
        }
    }
`;

export const PHONE_NUMBER_CHANGE_VERIFY = gql`
    mutation PhoneNumberChangeVerify($data: PhoneNumberChangePinVerifyInput!) {
        phoneNumberChangeVerify(data: $data) {
            ok
            errors
        }
    }
`;

export const SEND_MESSAGE = gql`
    mutation ContactUs($input: ContactUsMutationInput!) {
        contactUs (input: $input) {
            name
            errors {
              field
              messages
            }
        }
    }
`;

export const GET_HAPPENING_SURVEY_COMMENTS = gql`
  query Comments($surveyId: String!, $level: Int) {
    comments(objectId: $surveyId, level: $level) {
      id
      createdAt
      modifiedAt
      description
      totalLikes
      hasLiked
      isDeleted
      user {
        id
        firstName
        lastName
        avatar
      }
      replies {
        id
        createdAt
        modifiedAt
        description
        totalLikes
        hasLiked
        isDeleted
        user {
          id
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
    mutation CreateComment($input: CommentMutationInput!) {
        createComment(input: $input) {
            id
            description
            errors {
                field
                messages
            }
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($input: UpdateCommentInput!) {
        updateComment(input: $input) {
            ok
            errors {
                field
                messages
            }
        }
    }
`;

export const LIKE_COMMENT = gql`
    mutation LikeComment($input: LikeCommentMutationInput!) {
        likeComment(input: $input) {
            id
            errors {
                field
                messages
            }
        }
    }
`;

export const DISLIKE_COMMENT = gql`
    mutation DislikeComment($id: Int!) {
        dislikeComment(id: $id) {
            ok
            errors
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            ok
            errors {
                field
                messages
            }
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
        changePassword(data: $data) {
            ok
        }
    }
`;

export const EMAIL_CHANGE = gql`
  mutation EmailChange($data: EmailChangeInput!) {
    emailChange(data: $data) {
      ok
      errors
    }
  }
`;

export const EMAIL_CHANGE_VERIFY = gql`
  mutation EmailChangeVerify($data: EmailChangePinVerifyInput!) {
    emailChangeVerify(data: $data) {
      ok
      errors
    }
  }
`;

export const SET_PASSWORD = gql`
  mutation SetPassword($data: SetPasswordInput!) {
    setPassword(data: $data) {
      ok
      errors
    }
  }
`;

export const UPLOAD_MEDIA = gql`
    mutation UploadMedia($media: Upload, $title: String!, $type: String!  ) {
        uploadMedia(media: $media, title: $title, type: $type) {
            result {
                title
                media
            }
            ok
            errors
        }
    }
`;

export const GET_PROJECTS = gql`
  query Projects($tab: String) {
    projects(tab: $tab) {
      id
      title
      logo
    }
  }
`;
