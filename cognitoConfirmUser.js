import { CognitoUser } from "amazon-cognito-identity-js";
import { createUserPool } from "./createUserPool.js";

const userPool = createUserPool();

export const cognitoConfirmUser = (username, code, callback) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  cognitoUser.confirmRegistration(code, true, (err, result) => {
    if (err) {
      console.log(err);
      callback({
        message: "Uyelik onaylanamadi. Lutfen tekrar deneyin.",
      });
      return;
    }
    callback({
      message: "Uyelik onaylandi.",
    });
  });
};
