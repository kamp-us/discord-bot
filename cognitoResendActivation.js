import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./config.js";

export const cognitoResendActivation = (username, callback) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  cognitoUser.resendConfirmationCode((err) => {
    if (err) {
      callback({
        message: err.message,
      });
      return;
    }
    callback({
      message: "Aktivasyon kodu başarıyla gönderildi.",
    });
  });
};
