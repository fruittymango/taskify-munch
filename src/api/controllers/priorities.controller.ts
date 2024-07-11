import { FastifyRequest, FastifyReply } from "fastify";
import { getAllPriorities } from "../services/priority.service";
import Priority from "../../database/models/Priority";
import unsanitize from "../../utils/unsanitize";

export class PrioritiesController {
    static async GetPriorities(request: FastifyRequest, reply: FastifyReply) {
        const prioritiesExist = (await getAllPriorities())?.map((value: Priority) => {
            return {
                ...value.dataValues,
                title: unsanitize(value.dataValues.title),
            }
        });
        return reply.status(200).send(prioritiesExist);
    }
}