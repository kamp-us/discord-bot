import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { createUserPool } from "./createUserPool.js";

const generatePassword = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

const userPool = createUserPool();

export const cognitoSignUp = (username, email, callback) => {
  const emailData = {
    Name: "email",
    Value: email,
  };
  const emailAttribute = new CognitoUserAttribute(emailData);
  const password = generatePassword(8);

  userPool.signUp(username, password, [emailAttribute], null, (err, result) => {
    if (err) {
      callback({ username: null, password: null, error: err.message });
    } else {
      callback({ username: result.user.getUsername(), password, error: null });
    }
  });
};
