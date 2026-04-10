import { Role, UserStatus } from "@core/enum/user";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import { PaginationResult } from "@core/types/common";
import { Pagination } from "@core/utils/pagination";
import { toUserViewDTO, UserCreateDTO, UserPaginationQuery, UserUpdateDTO, UserViewDTO } from "../dtos/user-dto";
import User from "../models/user";
import IUserService from "./iuser-service";

export default class UserService implements IUserService {
    private userRepo: IGenericRepository<User>;

    constructor(userRepo: IGenericRepository<User>) {
        this.userRepo = userRepo;
    }
    async deleteAsync(id: string): Promise<boolean> {
        await this.getByIdAsync(id);
        await this.userRepo.removeAsync(id);
        return true;
    }

    async changeStatusAsync(id: string, status: UserStatus): Promise<boolean> {
        const user = await this.getByIdAsync(id);
        user.status = status;
        await this.userRepo.editAsync(id, user);
        return true;

    }

    async changeRoleAsync(id: string, role: Role): Promise<boolean> {
        const user = await this.getByIdAsync(id);
        if (user.status === UserStatus.BANNED) {
            return Promise.reject(Error('Người dùng này đang bị ban'));
        }
        user.role = role;
        await this.userRepo.editAsync(id, user);
        return true;
    }

    async createAsync(value: UserCreateDTO): Promise<string> {
        const newUser = new User(value.userName, value.password);
        newUser.role = value.role;
        newUser.status = value.status;
        newUser.password = value.password;
        await this.userRepo.addAsync(newUser);
        return "Tạo người dùng thành công";
    }
    async updateAsync(id: string, value: UserUpdateDTO): Promise<string> {
        await this.userRepo.getByIdAsync(id);
        await this.userRepo.editAsync(id, value);
        return "Cập người dùng thành công";
    }
    async getAsync(query: UserPaginationQuery): Promise<PaginationResult<UserViewDTO>> {
        const users = await this.userRepo.getAsync(query.pageIndex, query.pageSize, (queryDB) => {
            let querySearch = queryDB.select('*').neq('role', Role.OWNER);
            if (query.search) {
                querySearch = querySearch.ilike('name', `%${query.search}%`);
            }
            return querySearch;
        });
        return Pagination<UserViewDTO>(users.data.map(u => toUserViewDTO(u)), users.count, query.pageSize, query.pageIndex);
    }
    async getByIdAsync(id: string): Promise<UserViewDTO> {
        const user = await this.userRepo.getByIdAsync(id);
        if (!user) {
            return Promise.reject(Error('Người dùng không tồn tại'));
        }
        return toUserViewDTO(user);
    }

}