import Priority, { PriorityInput } from '../../database/models/Priority';

export const getAllPriorities = async (): Promise<Priority[]> => {
    return await Priority.findAll();
}

export const addBulkPriorities = async (payload: PriorityInput[]): Promise<Priority[]> => {
    const priorities = await Priority.bulkCreate(payload)
    return priorities
} 