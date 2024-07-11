import Status, { StatusInput } from '../../database/models/Status';
import { NotFoundError } from '../../helpers/errors';

export const getAllStatuses = async (): Promise<Status[]> => {
    return Status.findAll();
}

export const addBulkStatuses = async (payload: StatusInput[]): Promise<Status[]> => {
    const labels = await Status.bulkCreate(payload)
    return labels
} 