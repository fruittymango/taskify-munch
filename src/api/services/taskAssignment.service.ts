import TaskAssignments, { TaskAssignmentInput } from '../../database/models/TaskAssignments';
import { NotFoundError } from '../../helpers/errors';

export const createTaskAssignments = async (payload: TaskAssignmentInput): Promise<TaskAssignments> => {
    const taskAssignment = await TaskAssignments.findOrCreate(
        {where:{ ...payload}},
    )
    return taskAssignment[0];
}

export const getTaskAssignmentsByTaskId = async (userTaskId: number): Promise<TaskAssignments[]> => {
    const taskAssignment = await TaskAssignments.findAll({
        where:{
            taskId: userTaskId
        }, paranoid:false
    })
    if (!taskAssignment || taskAssignment.length < 1) {
        // @todo throw custom error
        throw new NotFoundError('Task assignments not found')
    }
    return taskAssignment
}

export const getTaskAssignmentsByTaskIdUserId = async (userId: number, taskId:number): Promise<TaskAssignments> => {
    const taskAssignment = await TaskAssignments.findOne({
        where:{
            taskId, userId
        }, paranoid:false
    })
    if (!taskAssignment) {
        // @todo throw custom error
        throw new NotFoundError('Task assignment not found');
    }
    return taskAssignment
}

export const deleteTaskAssignmentsByUserIdTaskId = async (userId: number, taskId: number): Promise<boolean> => {
    const deletedTaskAssignmentsCount = await TaskAssignments.destroy({
        where: {taskId, userId}
    })
    return !!deletedTaskAssignmentsCount
}
