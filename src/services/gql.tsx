import {gql} from '@apollo/client';

export const PASSWORD_RESET = gql`
    mutation PasswordReset($data: PasswordResetPinInput!) {
        passwordReset(data: $data) {
            ok
        }
    }
`;

export const PASSWORD_RESET_VERIFY = gql`
    mutation PasswordResetVerify($data: PasswordResetPinInput!) {
        passwordResetVerify(data: $data) {
            ok
            result {
                identifier
            }
        }
    }
`;

export const PASSWORD_RESET_CHANGE = gql`
    mutation PasswordResetChange($data: PasswordResetChangeInput!) {
        passwordResetChange(data: $data) {
            ok
        }
    }
`;
