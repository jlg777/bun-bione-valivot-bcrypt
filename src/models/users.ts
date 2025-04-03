//import * as v from 'valibot';
import { email, endsWith, minLength, object, pipe, string, type InferInput }from 'valibot';

const EmailSchema = pipe(string(), email(), endsWith('@example.com'));
const PasswordSchema = pipe(string(), minLength(6),)

export const authSquema = object({
email: EmailSchema,
password: PasswordSchema
})

export type User = InferInput<typeof authSquema>

const users : Map<string, User> = new Map()