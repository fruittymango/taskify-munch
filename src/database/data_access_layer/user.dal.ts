import { Op } from 'sequelize';
import User, { UserInput } from '../models/User.model';

export const createUser = async (payload: UserInput): Promise<User> => {
    const user = await User.create(payload)
    return user
}

export const updateUser = async (id: number, payload: Partial<UserInput>): Promise<User> => {
    const user = await User.findByPk(id)
    if (!user) {
        throw new Error('User not found')
    }
    const updatedUser = await (user as User).update(payload)
    return updatedUser
}

export const getUserById = async (id: number): Promise<User> => {
    const user = await User.findByPk(id)
    if (!user) {
        // @todo throw custom error
        throw new Error('User not found')
    }
    return user
}

export const getUserByGuid = async (userGuid:string): Promise<User> => {
    const user = await User.findOne({where:{guid: userGuid}})
    if (!user) {
        // @todo throw custom error
        throw new Error('User not found')
    }
    return user
}

export const getUserByEmail = async (userEmail: string): Promise<User> => {
    const user = await User.findOne({
        where:{
            email:{[Op.eq]:userEmail}
        }
    })
    if (!user) {
        // @todo throw custom error
        throw new Error('User email not found')
    }
    return user
}

export const deleteUserById = async (id: number): Promise<boolean> => {
    const deletedUserCount = await User.destroy({
        where: {id}
    })
    return !!deletedUserCount
}

export const getAllUsers = async (): Promise<User[]> => {
    return User.findAll()
}

export const addBulkUsers = async (payload: UserInput[]): Promise<User[]> => {
    return await User.bulkCreate(payload);
}