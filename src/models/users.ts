//import * as v from 'valibot';
import { hash } from 'bcrypt';
import { email, endsWith, minLength, pipe, string, object, type InferInput } from 'valibot';

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
  refreshtoken: string;
};

const users: Map<string, User> = new Map();

/**
 * Creates a new user with the given email and password.
 * The password is hashed before storing.
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<User>} - The created user
 */
export const createUser = async (email: string, password: string): Promise<User> => {
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
  return newUser


  // Return the created user
  return newUser;
};

/**
 * Finds a new user by their given email
 * 
 * @param {string} - The email of the user to find.
 * @return {User | undefined} = The user if found, otherwise undefined.
 */
export const findUserbyEmail = (email: string): User | undefined => {
  return users.get(email)
}