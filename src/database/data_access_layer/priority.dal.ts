import Priority, { PriorityInput } from '../models/Priority.model';

export const createPriority = async (payload: PriorityInput): Promise<Priority> => {
    const priority = await Priority.create(payload)
    return priority
}

export const updatePriority = async (id: number, payload: Partial<PriorityInput>): Promise<Priority> => {
    const priority = await Priority.findByPk(id)
    if (!priority) {
        // @todo throw custom error
        throw new Error('Priority not found')
    }
    const updatedPriority = await (priority as Priority).update(payload)
    return updatedPriority
}

export const getPriorityById = async (id: number): Promise<Priority> => {
    const priority = await Priority.findByPk(id)
    if (!priority) {
        // @todo throw custom error
        throw new Error('Priority not found')
    }
    return priority
}

export const deletePriorityById = async (id: number): Promise<boolean> => {
    const deletedPriorityCount = await Priority.destroy({
        where: {id}
    })
    return !!deletedPriorityCount
}

export const getAllPriorities = async (): Promise<Priority[]> => {
    return await Priority.findAll();
}

export const addBulkPrioties = async (payload: PriorityInput[]): Promise<Priority[]> => {
    const priorities = await Priority.bulkCreate(payload)
    return priorities
} 