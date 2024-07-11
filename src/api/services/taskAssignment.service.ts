import TaskAssignments, { TaskAssignmentInput } from '../../database/models/TaskAssignments';
import { NotFoundError } from '../../helpers/errors';

export const createTaskAssignments = async (payload: TaskAssignmentInput): Promise<TaskAssignments> => {
    const taskAssignment = await TaskAssignments.findOrCreate(
        { where: { ...payload } },
    )
    return taskAssignment[0];
}

export const deleteTaskAssignmentsByUserIdTaskId = async (userId: number, taskId: number): Promise<boolean> => {
    const deletedTaskAssignmentsCount = await TaskAssignments.destroy({
        where: { taskId, userId }
    })
    return !!deletedTaskAssignmentsCount
}
