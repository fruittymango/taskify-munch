
import { FastifyRequest, FastifyReply } from 'fastify';
import Label, { LabelInput } from '../../database/models/Label';
import { getAllLabels, createLabel } from '../services/label.service';
import unsanitize from '../../utils/unsanitize';

export class LabelsController {
    static async GetLabels(request: FastifyRequest, reply: FastifyReply) {
        const allLabels = (await getAllLabels())?.map((value: Label) => {
            return {
                ...value.dataValues,
                title: unsanitize(value.dataValues.title),
            }
        });
        return reply.status(200).send(allLabels);
    }

    static async AddLabel(request: FastifyRequest, reply: FastifyReply) {
        const labelInput: LabelInput = request.body as LabelInput;
        const addedLabels = await createLabel({
            title: labelInput.title,
        });
        return reply.status(200).send({ ...addedLabels, title: unsanitize(addedLabels.title) });
    }
}