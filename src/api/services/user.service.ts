import { Op, UniqueConstraintError } from 'sequelize';
import User, { UserInput } from '../../database/models/User';
import { BadRequestError, NotFoundError } from '../../helpers/errors';

export const createUser = async (payload: UserInput): Promise<User> => {
    try {
        const user = await User.create(payload)
        return user
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw new BadRequestError('User profile exist already.')
        } else {
            throw new BadRequestError('Failed to save new user details.')
        }
    }
}

export const getUserByEmail = async (userEmail: string): Promise<User> => {
    const user = await User.findOne({
        where: {
            email: { [Op.eq]: userEmail }
        }
    })
    if (!user) {
        throw new NotFoundError('User email not found')
    }
    return user
}

export const getUserById = async (id: number): Promise<User> => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError('User not found')
    }
    return user
}

export const getAllUsers = async (): Promise<User[]> => {
    return User.findAll({ paranoid: false })
}

export const addBulkUsers = async (payload: UserInput[]): Promise<User[]> => {
    return await User.bulkCreate(payload);
}