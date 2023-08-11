import { prisma } from "@/config";
import { Activities } from "@prisma/client";

async function getEventActivities(eventId: number){
    return prisma.activities.findMany({
        where: {
            eventId
        }
    });
}

const activitiesRepository = {
    getEventActivities
};

export default activitiesRepository;