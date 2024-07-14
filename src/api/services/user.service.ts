import { Op } from "sequelize";
import User, { UserInput } from "../../database/models/User";
import { DatabaseRelatedError, NotFoundError } from "../../helpers/errors";

export const createUser = async (payload: UserInput): Promise<User> => {
    try {
        const user = await User.create(payload);
        return user;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to save new user.");
    }
};

export const getUserByEmail = async (userEmail: string): Promise<User> => {
    try {
        const user = await User.findOne({
            where: {
                email: { [Op.eq]: userEmail },
            },
        });
        if (!user) {
            throw new NotFoundError("User email not found");
        }
        return user;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to get user by email.");
    }
};

export const getUserById = async (id: number): Promise<User> => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to get user by id.");
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        return User.findAll({
            paranoid: false,
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "userId",
                    "password",
                ],
            },
        });
    } catch (error) {
        throw new DatabaseRelatedError("Failed to get available users.");
    }
};

export const addBulkUsers = async (payload: UserInput[]): Promise<User[]> => {
    try {
        return await User.bulkCreate(payload);
    } catch (error) {
        throw new DatabaseRelatedError("Failed to add bulk users.");
    }
};
