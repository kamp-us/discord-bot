import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./config.js";

export const cognitoConfirmUser = (username, code, callback) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  cognitoUser.confirmRegistration(code, true, (err, result) => {
    if (err) {
      callback({
        message:
          "Bir hata oluştu. Lutfen tekrar deneyin. Eğer hata devam ederse, lütfen bize ulaşın.",
      });
    } else {
      callback({
        message: "Üyelik onaylandı.",
      });
    }
  });
};
