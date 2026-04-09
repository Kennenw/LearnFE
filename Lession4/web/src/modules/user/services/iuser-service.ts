import { Role } from '@core/enum/user';
import { PaginationResult } from '@core/types/common';
import { UserCreateDTO, UserUpdateDTO, UserViewDTO } from '../dtos/user-dto';
export default interface IUserService {
    createUser(value: UserCreateDTO): Promise<string>;
    updateUser(id: string, value: UserUpdateDTO): Promise<string>;
    getUser(search?: string, pageIndex?: number, pageSize?: number): Promise<PaginationResult<UserViewDTO>>;
    getUserById(id: string): Promise<UserViewDTO>;
    banUser(id: string): Promise<boolean>;
    unBanUser(id: string): Promise<boolean>;
    decentralize(id: string, role: Role): Promise<boolean>;
}