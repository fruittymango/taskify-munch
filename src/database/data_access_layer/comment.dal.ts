import Comment, { CommentInput } from '../models/Comment.model';

export const createComment = async (payload: CommentInput): Promise<Comment> => {
    const comment = await Comment.create(payload)
    return comment
}

export const updateComment = async (commentGuid: string, payload: Partial<CommentInput>): Promise<Comment> => {
    const comment = await Comment.findOne({where:{guid:commentGuid}})
    if (!comment) {
        // @todo throw custom error
        throw new Error('Comment not found')
    }
    const updatedComment = await (comment as Comment).update(payload)
    return updatedComment
}

export const getCommentByGuid = async (commentGuid: string): Promise<Comment> => {
    const comment = await Comment.findOne({where:{guid:commentGuid}})
    if (!comment) {
        // @todo throw custom error
        throw new Error('Comment not found')
    }
    return comment
}

export const getCommentById = async (id:number): Promise<Comment> => {
    const comment = await Comment.findByPk(id)
    if (!comment) {
        // @todo throw custom error
        throw new Error('Comment not found')
    }
    return comment
}

export const deleteCommentByGuid = async (guid: string): Promise<boolean> => {
    const deletedCommentCount = await Comment.destroy({
        where: {guid}
    })
    return !!deletedCommentCount
}