import CommentAssignment, { CommentAssignmentInput } from '../models/CommentAssignment.model';

export const createCommentAssignment = async (payload: CommentAssignmentInput): Promise<CommentAssignment> => {
    const commentAssignment = await CommentAssignment.create(payload)
    return commentAssignment
}

export const getCommentAssignmentsByTaskId = async (taskId:number): Promise<CommentAssignment[]> => {
    const commentAssignments = await CommentAssignment.findAll({where:{taskId}})
    return commentAssignments
}

// export const deleteCommentAssignmentByCommentIdTaskId = async (commentId: number, taskId:number): Promise<boolean> => {
//     const deletedCommentAssignmentCount = await CommentAssignment.destroy({
//         where: {taskId, commentId}
//     })
//     return !!deletedCommentAssignmentCount
// }