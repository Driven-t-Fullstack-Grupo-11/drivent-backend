import sessionRepository from '@/repositories/session-repository';
import userRepository from '@/repositories/user-repository';
import { exclude } from '@/utils/prisma-utils';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from './errors';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'query-string';
import userService from '../users-service';

dotenv.config();

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

export async function signInUserWithGitHub(code: string) {
  const token = await exchangeCodeForAccesToken(code);

  return token;
}

/* async function asdaksjsd(){
  const { email } = req.body;
  console.log(req.body);
  const password = uuidv4();
  console.log('Token da service', token);

  let user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if(!user) {
    user = await userService.createUser({email, password});
  }

  await validatePasswordOrFail(password, user.password);

  await createSessionAuth(user.id, token)
  console.log(user);

  console.log('Token da service', token);

  let user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if(!user) {
    user = await userService.createUser({email, password});
  }

  await validatePasswordOrFail(password, user.password);

  await createSessionAuth(user.id, token)
  console.log(user);
} */

type GitHubParamsForAccesToken = {
  code: string;
  grant_type: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
};

async function exchangeCodeForAccesToken(code: string) {
  const GITHUB_ACCES_TOKEN_URL = 'https://github.com/login/oauth/access_token';

  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  const params: GitHubParamsForAccesToken = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/sign-in',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  const { data } = await axios.post(GITHUB_ACCES_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { access_token } = qs.parse(data);
  return Array.isArray(access_token) ? access_token.join('') : access_token;
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function createSessionAuth(userId: number, token: string) {
  await sessionRepository.create({
    token,
    userId,
  });

}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, 'email' | 'password'>;
export type GithubSignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

const authenticationService = {
  signIn,
  signInUserWithGitHub,
};

export default authenticationService;
export * from './errors';
