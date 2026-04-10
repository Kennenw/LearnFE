import GenericRepository from "@infrastructure/database/repositories/generic-repository";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import User from "../models/user";
import IUserService from "../services/iuser-service";
import UserService from "../services/user-service";
import { UserCreateDTO, UserPaginationQuery, UserUpdateDTO } from "../dtos/user-dto";
import { Role, UserStatus } from "@core/enum/user";

const userRepo: IGenericRepository<User> = new GenericRepository<User>('users');
const userService: IUserService = new UserService(userRepo);

export const UserController = {
    async getUsers(query: UserPaginationQuery) {
        return await userService.getAsync(query);
    },

    async getUserById(id: string) {
        return await userService.getByIdAsync(id);
    },

    async createUser(data: UserCreateDTO) {
        return await userService.createAsync(data);
    },

    async updateUser(id: string, data: UserUpdateDTO) {
        return await userService.updateAsync(id,data);
    },

    async deleteUser(id: string) {
        return await userService.deleteAsync(id);
    },

    async banUser(id: string){
        return await userService.changeStatusAsync(id, UserStatus.BANNED);
    },

    async unBanUser(id: string){
        return await userService.changeStatusAsync(id, UserStatus.ACTIVE);
    },

    async decentralieUser(id: string, role: Role){
        return await userService.changeRoleAsync(id, role);
    }
};