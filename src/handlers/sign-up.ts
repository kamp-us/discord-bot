import fetch, { FormData } from "node-fetch";
import { generatePassword, validateEmail, validateUsername } from "../utils";

const Error = (message: string) => {
  return { errors: message, data: { user: {}, password: "" } };
};

interface Errors {
  email?: string;
  username?: string;
  password?: string;
}
interface ActionData {
  data: any;
  errors: Errors;
}
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export const signUp = async (username: string, email: string) => {
  if (!validateUsername(username)) {
    return Error("Username is invalid");
  }
  if (!validateEmail(email)) {
    return Error("Email is invalid");
  }

  // const existingUserByEmail = await getUserByEmail(prisma, email);
  // const existingUserByUsername = await getUserByUsername(prisma, username);
  // if (existingUserByEmail) {
  //   return Error("Someone is registered with this email");
  // }
  // if (existingUserByUsername) {
  //   return Error("This username is taken");
  // }

  const password = generatePassword();
  const form = new FormData();
  form.append("username", username);
  form.append("email", email);
  form.append("password", password);

  try {
    const url = "https://pano.kamp.us/api/auth/register";
    const response = await fetch(url, {
      method: "POST",
      body: form,
    });

    const user = (await response.json()) as ActionData;
    if (user.errors && !isEmpty(user.errors)) {
      const errorMessage = getErrorMessage(user.errors);
      return Error(errorMessage);
    } else {
      return { errors: "", data: { user: user.data, password } };
    }
  } catch (e) {
    return Error(`Error: ${e}`);
  }
};

const getErrorMessage = (errors: Errors) => {
  if (errors.email) return errors.email;
  if (errors.username) return errors.username;
  if (errors.password) return errors.password;
  return "Something went wrong";
};
