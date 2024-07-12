import Priority, { PriorityInput } from "../../database/models/Priority";
import { DatabaseRelatedError, NotFoundError } from "../../helpers/errors";

export const getAllPriorities = async (): Promise<Priority[]> => {
    try {
        return await Priority.findAll();
    } catch (error) {
        throw new DatabaseRelatedError("Failed to get available priorities.");
    }
};

export const findPriorityByTitle = async (title: string): Promise<Priority> => {
    try {
        console.log(title);
        const priority = await Priority.findOne({ where: { title } });
        if (!priority) {
            throw new NotFoundError("Priority not found");
        }
        return priority;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to find priority by the title.");
    }
};

export const addBulkPriorities = async (
    payload: PriorityInput[]
): Promise<Priority[]> => {
    try {
        const priorities = await Priority.bulkCreate(payload);
        return priorities;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to add bulk priorities.");
    }
};
