import { FastifyRequest, FastifyReply } from "fastify";
import { getAllStatuses } from "../services/statuses.service";
import unsanitize from "../../utils/unsanitize";
import Status from "../../database/models/Status";

export class StatusesController {
    static async GetStatuses(request: FastifyRequest, reply: FastifyReply) {
        const allStatuses = (await getAllStatuses())?.map((value: Status) => {
            return {
                ...value.dataValues,
                title: unsanitize(value.dataValues.title),
            };
        });
        return reply.status(200).send(allStatuses);
    }
}
