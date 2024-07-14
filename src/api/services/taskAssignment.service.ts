import TaskAssignments, {
    TaskAssignmentInput,
} from "../../database/models/TaskAssignments";
import { DatabaseRelatedError } from "../../helpers/errors";

export const createTaskAssignments = async (
    payload: TaskAssignmentInput
): Promise<TaskAssignments> => {
    try {
        const assignmentExist = await TaskAssignments.findOne({
            where: { ...payload },
        });
        if (assignmentExist) {
            throw new DatabaseRelatedError("Task has already been assigned.");
        }
        const taskAssignment = await TaskAssignments.create({
            ...payload,
        });
        return taskAssignment;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to assign to the task.");
    }
};

export const deleteTaskAssignmentsByUserIdTaskId = async (
    userId: number,
    taskId: number
): Promise<boolean> => {
    try {
        const deletedTaskAssignmentsCount = await TaskAssignments.destroy({
            where: { taskId, userId },
        });
        return !!deletedTaskAssignmentsCount;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to remove user from the task.");
    }
};
