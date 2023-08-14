import { Router } from "express";

import { createUserSchema } from "@/schemas";
import { authGitHubToken, validateBody } from "@/middlewares";
import { getProfileFromGithub, usersPost } from "@/controllers";

const usersRouter = Router();

usersRouter.post("/", validateBody(createUserSchema), usersPost);
usersRouter.get('/profile', authGitHubToken,getProfileFromGithub);

export { usersRouter };
