import { createUserPool } from "./createUserPool.js";
import { CognitoUser } from "amazon-cognito-identity-js";

const userPool = createUserPool();

export const cognitoResendActivation = (username, callback) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  cognitoUser.resendConfirmationCode((err) => {
    if (err) {
      callback({
        message: "Aktivasyon kodu gonderme islemi basarisiz. Lutfen tekrar deneyiniz",
      });
      return;
    }
    callback({
      message: "Aktivasyon kodu başarıyla gönderildi.",
    });
  });
};
