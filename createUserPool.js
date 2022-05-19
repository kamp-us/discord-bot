import { COGNITO_CLIENT_ID, COGNITO_USERPOOL_ID } from "./config.js";
import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: COGNITO_USERPOOL_ID,
  ClientId: COGNITO_CLIENT_ID,
};

export const createUserPool = () => {
  return new CognitoUserPool(poolData);
};
