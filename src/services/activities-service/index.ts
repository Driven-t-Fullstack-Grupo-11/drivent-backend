import { notFoundError } from "../../errors";
import { cannotListEventError } from "../../errors/cannot-list-events";
import { cannotListHotelsError } from "../../errors/cannot-list-hotels-error";
import activitiesRepository from "../../repositories/activities-repository";
import enrollmentRepository from "../../repositories/enrollment-repository";
import ticketRepository from "../../repositories/ticket-repository";

async function checkTicketInfos(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
      throw notFoundError();
    }
  
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket || ticket.status === 'RESERVED'){
      throw cannotListHotelsError();
    } else if( ticket.TicketType.isRemote){
      return cannotListEventError();
    }
    console.log("passou");
    return true;
}

async function getEventActivities(userId: number, eventId: number){
    await checkTicketInfos(userId);

    const eventActivities = await activitiesRepository.getEventActivities(eventId);
    return eventActivities;

}

const activitiesService = {
    getEventActivities
}

export default  activitiesService;