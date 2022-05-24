import { CognitoUserPool } from "amazon-cognito-identity-js";

export const DISCORD_TOKEN = "OTY3NTI0OTM2NTUxODk1MDUx.YmRj0A.Qgn849DFxCQpC2evCr2MB_suQ3A";
export const GUILD_ID = "504590280675295233";
export const KAMPUS_GUILD_ID = "839425986817818654";
export const CLIENT_ID = "967524936551895051";
export const COGNITO_USERPOOL_ID = "eu-central-1_qjcEK6bV5";
export const COGNITO_CLIENT_ID = "4gp7ftff543envgdr5alpa2105";
export const PANO_PREFIX = "!pano-";

const poolData = {
  UserPoolId: COGNITO_USERPOOL_ID,
  ClientId: COGNITO_CLIENT_ID,
};

export const createUserPool = () => {
  return new CognitoUserPool(poolData);
};
export const userPool = createUserPool();
