import { Op } from 'sequelize';
import Task, { TaskInput } from '../../database/models/Task';
import Project from '../../database/models/Project';
import TaskAssignment from '../../database/models/TaskAssignments';
import { NotFoundError } from '../../helpers/errors';

export const createTask = async (payload: TaskInput): Promise<Task> => {
    const task = await Task.create(payload)
    return task
}

export const updateTask = async (id: number, payload: Partial<TaskInput>): Promise<Task> => {
    const task = await Task.findByPk(id, {paranoid:false})
    if (!task) {
        throw new NotFoundError('Task not found')
    }
    return await (task as Task).update(payload)
}

export const updateTaskByGuid = async (guid: string, payload: Partial<TaskInput>): Promise<Task> => {
    const task = await Task.findOne({where:{guid}, paranoid:false})
    if (!task) {
        throw new NotFoundError('Task not found')
    }
    return await (task as Task).update(payload)
}


export const deleteTaskByGuid = async (guid: string): Promise<boolean> => {
    const deletedTaskCount = await Task.destroy({
        where: {guid},
    })
    if (!deletedTaskCount) {
        throw new NotFoundError('Task not found')
    }
    return !!deletedTaskCount
}

export const getTasksByProjectGuid = async (projectGuid:string): Promise<Task[]> => {

    const result = await Task.findAll({
        where:{
            '$project.guid$':projectGuid,
        },
        paranoid:false,
        attributes: ['id', 'guid', 'projectId', 'dueDate', 'createdBy', 'statusId', 'title', 'description'],
        include:[{model: Project, as: 'project',}, {model: TaskAssignment, as: 'task_assignments',}]
    })
    if (!result) {
        throw new NotFoundError("Tasks not found")
    }
    return result;

}

export const getTaskByGuid = async (taskGuid:string): Promise<Task> => {
    
    const result = await Task.findOne({
        where:{
            guid:taskGuid,
        },
        paranoid:false,
        include:[
            {model: TaskAssignment, as: 'task_assignments'},
            // {model: CommentAssignment, as: 'comment_assignments'},
        ]
    })
    if (!result) {
        throw new NotFoundError("Task not found")
    }
    return result;
}