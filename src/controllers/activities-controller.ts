import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares";
import activitiesService from "@/services/activities-service";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const { eventId } = req.params;

    try{
        const eventActivities = await activitiesService.getEventActivities(userId, Number(eventId));
        return res.status(httpStatus.OK).send(eventActivities);
    } catch(error){
        if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === "cannotListHotelsError") {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
        if (error.name === "cannotListEventError") {
            return res.sendStatus(httpStatus.NO_CONTENT);
        }
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
} 
