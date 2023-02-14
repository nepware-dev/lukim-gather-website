import {gql} from '@apollo/client';

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
