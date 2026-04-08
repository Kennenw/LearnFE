import { Role, UserStatus } from "../../../core/enum/user";
import IGenericRepository from "../../../core/interfaces/igeneric-repository";
import { PaginationResult } from "../../../core/types/common";
import { Pagination } from "../../../core/utils/pagination";
import { toUserViewDTO, UserCreateDTO, UserUpdateDTO, UserViewDTO } from "../dtos/user-dto";
import User from "../models/user";
import IUserService from "./iuser-service";

export default class UserService implements IUserService {
    private userRepo: IGenericRepository<User>;

    constructor(userRepo: IGenericRepository<User>) {
        this.userRepo = userRepo;
    }
    async banUser(id: string): Promise<boolean> {
        const user = await this.userRepo.getByIdAsync(id);
        if (!user) return Promise.reject(Error('Người dùng không tồn tại'));
        user.status = UserStatus.Banned;
        await this.userRepo.editAsync(id, user);
        return true;
    }
    async unBanUser(id: string): Promise<boolean> {
        const user = await this.userRepo.getByIdAsync(id);
        if (!user) return Promise.reject(Error('Người dùng không tồn tại'));
        user.status = UserStatus.Active;
        await this.userRepo.editAsync(id, user);
        return true;

    }
    async decentralize(id: string, role: Role): Promise<boolean> {
        const user = await this.userRepo.getByIdAsync(id);
        if (!user) return Promise.reject(Error('Người dùng không tồn tại'));
        if (user.status === UserStatus.Banned) return Promise.reject(Error('Người dùng này đang bị ban'));
        user.role = role;
        await this.userRepo.editAsync(id, user);
        return true;
    }

    async createUser(value: UserCreateDTO): Promise<string> {
        const newUser = new User(value.userName, value.password);
        newUser.role = value.role;
        newUser.status = value.status;
        newUser.password = value.password;
        await this.userRepo.addAsync(newUser);
        return "Tạo người dùng thành công";
    }
    async updateUser(id: string, value: UserUpdateDTO): Promise<string> {
        const user = await this.userRepo.getByIdAsync(id);
        if (!user) return Promise.reject(Error('Người dùng tồn tại'));
        await this.userRepo.editAsync(id, value);
        return "Cập người dùng thành công";
    }
    async getUser(search?: string, pageIndex?: number, pageSize?: number): Promise<PaginationResult<UserViewDTO>> {
        const users = await this.userRepo.getAsync(pageIndex, pageSize, (b) => {
            return b.select('*').ilike('name', `%${search}%`);
        });
        return Pagination<UserViewDTO>(users.data.map(u => toUserViewDTO(u)), users.count, pageSize, pageIndex);

    }
    async getUserById(id: string): Promise<UserViewDTO> {
        const user = await this.userRepo.getByIdAsync(id);
        if (!user) return Promise.reject(Error('Người dùng không tồn tại'));
        return toUserViewDTO(user);
    }

}