//import * as v from 'valibot';
import { compare, hash } from 'bcrypt';
import { email, endsWith, minLength, pipe, string, object, type InferInput, parse } from 'valibot';

const EmailSchema = pipe(string(), email(), endsWith('@example.com'));
const PasswordSchema = pipe(string(), minLength(6));

export const authSchema = object({
  email: EmailSchema,
  password: PasswordSchema,
});

export enum Role {
  "ADMIN"= "admin",
  "USER" = "user"
}

export type User = InferInput<typeof authSchema> & {
  id: number;
  role: Role;
  refreshtoken: string | undefined;
};

export const users: Map<string, User> = new Map();

/**
 * Creates a new user with the given email and password.
 * The password is hashed before storing.
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<User>} - The created user
 */
export const createUser = async (email: string, password: string): Promise<User> => {
   // Valida el email y password
   parse(authSchema, { email, password });
  // Hash the password
  const hashedPassword = await hash(password, 10);

  // Create the new user
  const newUser: User = {
    id: Date.now(), // Unique ID based on the timestamp
    email,
    password: hashedPassword,
    role: Role.USER, // Default role is 'user'
    refreshtoken: '', // Placeholder for refresh token
  };

  // Store the new user in the Map
  users.set(email, newUser);
  // Return the created user
  //console.log(users)
  return newUser

};

/**
 * Finds a new user by their given email
 * 
 * @param {string} email - The email of the user to find.
 * @return {User | undefined} - The user if found, otherwise undefined.
 */
export const findUserbyEmail = (email: string): User | undefined => users.get(email)


/**
 * validate a user's password
 * @param {User} user - The user to validate
 * @param {string} password - The password to validate
 * @return {Promise<boolean>} - True if the password is valid, otherwise false 
 */
export const validatePassword = async (user: User, password: string): Promise<boolean> => {
  // Compara el texto plano de la contraseña con el hash almacenado
  const isValid = await compare(password, user.password);
//console.log(users)
  if (isValid) {
    console.log("Contraseña válida.");
    return true;
  } else {
    console.log("Contraseña incorrecta.");
    return false;
  }
}

/**
 * Revoke Token
 * @param {string} email - The email of the user to revoke token.
 * @return {boolean} - True if the token is revoked, otherwise false.
 */
export const revokeUserToken = (email: string): boolean => {
  const foundUser = users.get(email)
  if(!foundUser) {
    return false
  }

  users.set(email, {...foundUser, refreshtoken: undefined})
  return true
} 

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  const user = findUserbyEmail(email);
  if (!user) return null;

  const valid = await validatePassword(user, password);
  return valid ? user : null;
};
