import Status, { StatusInput } from "../../database/models/Status";
import { DatabaseRelatedError, NotFoundError } from "../../helpers/errors";

export const getAllStatuses = async (): Promise<Status[]> => {
    try {
        return Status.findAll();
    } catch (error) {
        throw new DatabaseRelatedError("Failed to get available statuses.");
    }
};

export const findStatusByTitle = async (title: string): Promise<Status> => {
    try {
        const status = await Status.findOne({ where: { title } });
        if (!status) {
            throw new NotFoundError("Status not found");
        }
        return status;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to find status by title.");
    }
};

export const addBulkStatuses = async (
    payload: StatusInput[]
): Promise<Status[]> => {
    try {
        const labels = await Status.bulkCreate(payload);
        return labels;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to add bulk statuses.");
    }
};
