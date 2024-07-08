import { Op } from 'sequelize';
import TaskAssignments, { TaskAssignmentInput } from '../models/TaskAssignments.model';

export const createTaskAssignments = async (payload: TaskAssignmentInput): Promise<TaskAssignments> => {
    const taskAssignment = await TaskAssignments.create(payload)
    return taskAssignment
}

export const getTaskAssignmentsByTaskId = async (userTaskId: number): Promise<TaskAssignments[]> => {
    const taskAssignment = await TaskAssignments.findAll({
        where:{
            taskId: userTaskId
        }
    })
    if (!taskAssignment || taskAssignment.length < 1) {
        // @todo throw custom error
        throw new Error('Task assignments not found')
    }
    return taskAssignment
}

export const deleteTaskAssignmentsByUserIdTaskId = async (userId: number, taskId: number): Promise<boolean> => {
    const deletedTaskAssignmentsCount = await TaskAssignments.destroy({
        where: {taskId, userId}
    })
    return !!deletedTaskAssignmentsCount
}
