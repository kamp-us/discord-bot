import { CognitoUserPool } from "amazon-cognito-identity-js";

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const GUILD_ID = process.env.GUILD_ID;
export const CLIENT_ID = process.env.CLIENT_ID;
export const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

const poolData = {
  UserPoolId: COGNITO_USERPOOL_ID,
  ClientId: COGNITO_CLIENT_ID,
};

const createUserPool = () => {
  return new CognitoUserPool(poolData);
};

export const userPool = createUserPool();
