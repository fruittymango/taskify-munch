
import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserRequest, RegisterUserRequest } from '../types/user.types';
import { createUser, getAllUsers, getUserByEmail } from '../services/user.service';
import { FastifyJwtNamespace } from '@fastify/jwt';
import User from '../../database/models/User';
import { AuthError } from '../../helpers/errors';
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { FastifyRequest, } from "fastify/types/request";
import unsanitize from '../../utils/unsanitize';

declare module 'fastify' {
    interface FastifyRequest {
      startTime: number;
    }
    
    interface FastifyInstance extends 
      FastifyJwtNamespace<{namespace: 'security'}> {
    }
}

export class UserController {

    static async RegisterUser(request: RegisterUserRequest, reply: FastifyReply) {
        const guid = uuidv4();
        const {email, name, surname, password} = request.body;
        const hashedPassword = await argon2.hash(password);
        const userCreate = await createUser({guid, email, name, surname, password: hashedPassword});
        const newUser = {guid: userCreate.guid, email, name, surname};
        return reply.status(200).send({
            ...newUser,
            email:unsanitize(email),
            name:unsanitize(name),
            surname: unsanitize(surname)
        });
    };

    static async LoginUser(request: LoginUserRequest, reply:FastifyReply, fastify: FastifyInstance) {
        const {email, password} = request.body;
        const findUser: User = await getUserByEmail(email);
        const userVerified = await argon2.verify(findUser.password, password);
        if (!userVerified) {
            throw new AuthError("Invalid password.");
        }
        const token = fastify.jwt.sign(findUser.dataValues, {expiresIn:'1h'}) ;
        return reply.status(200).send({token});
    };

    static async GetUsers( request: FastifyRequest, reply:FastifyReply) {
        const allUsers = (await getAllUsers())?.map((value:User)=>{
            return {
                ...value.dataValues,
                name: unsanitize(value.dataValues.name),
                surname: unsanitize(value.dataValues.surname),
            }
        });
        return reply.send(allUsers);    
    };
}