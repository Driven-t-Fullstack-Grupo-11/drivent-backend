import userService from '@/services/users-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import userRepository from '../repositories/user-repository';
import authenticationService from '../services/authentication-service';

export async function usersPost(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await userService.createUser({ email, password });
    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.name === 'DuplicatedEmailError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getProfileFromGithub(req: Request, res: Response) {
  const { user } = res.locals;
  const email: string = user.email as string;
  const checkUser = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  const password = user.id;

  if(!checkUser) {
    const createdUser = await userService.createUser({
      email: email,
      password: password,
    })
    await authenticationService.signIn({email, password})
  }else{ 
    await authenticationService.signIn({email, password});
  }
  return res.send(user);
}
