import authenticationService, { GithubSignInParams, SignInParams } from '@/services/authentication-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function githubSignIn(req: Request, res: Response) {
  const code = req.body.code as string;

  try {
    const token = await authenticationService.signInUserWithGitHub(code);
    res.send({ token });
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send(error);
  }
}
