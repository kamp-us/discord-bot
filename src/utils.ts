import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
export function validateUsername(username: unknown): username is string {
  return typeof username === "string" && username.length >= 2;
}
export function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length > 8;
}
export function generatePassword() {
  return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
}
