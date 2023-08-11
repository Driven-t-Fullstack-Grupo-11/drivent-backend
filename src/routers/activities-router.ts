import { Router } from "express";
import { authenticateToken } from "../middlewares";
import { getActivities } from "../controllers/activities-controller";

const activitiesRouter = Router();

activitiesRouter.get("/:eventId", authenticateToken, getActivities);

export { activitiesRouter };