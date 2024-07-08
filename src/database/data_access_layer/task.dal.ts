import { Op } from 'sequelize';
import Task, { TaskInput } from '../models/Task.model';
import Project from '../models/Project.model';
import TaskAssignment from '../models/TaskAssignments.model';
import CommentAssignment from '../models/CommentAssignment.model';

export const createTask = async (payload: TaskInput): Promise<Task> => {
    const task = await Task.create(payload)
    return task
}

export const updateTask = async (id: number, payload: Partial<TaskInput>): Promise<Task> => {
    const task = await Task.findByPk(id)
    if (!task) {
        // @todo throw custom error
        throw new Error('Task not found')
    }
    return await (task as Task).update(payload)
}

export const getTaskById = async (id: number): Promise<Task> => {
    const task = await Task.findByPk(id)
    if (!task) {
        // @todo throw custom error
        throw new Error('Task not found')
    }
    return task
}

export const deleteTaskById = async (id: number): Promise<boolean> => {
    const deletedTaskCount = await Task.destroy({
        where: {id}
    })
    return !!deletedTaskCount
}

export const getTasksByProjectId = async (projectId:number): Promise<Task[]> => {
    return Task.findAll({
        where: {
            id: {[Op.eq]: projectId}
        },
    })
}
// Todo get a task with complete list of assigned pepople and comments and labels

export const getTasksByProjectGuid = async (projectGuid:string): Promise<Task[]> => {

    const result = await Task.findAll({
        where:{
            '$project.guid$':projectGuid,
        },
        include:[
            {model: Project, as: 'project'},
            {model: TaskAssignment, as: 'task_assignments'},
            {model: CommentAssignment, as: 'comment_assignments'},
        ]
    })
    return result;
}

export const addBulkTask = async (payload: TaskInput[]): Promise<Task[]> => {
    return await Task.bulkCreate(payload)
}