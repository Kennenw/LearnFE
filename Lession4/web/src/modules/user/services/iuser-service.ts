import { Role, UserStatus } from '@core/enum/user';
import { PaginationResult } from '@core/types/common';
import { UserCreateDTO, UserPaginationQuery, UserUpdateDTO, UserViewDTO } from '../dtos/user-dto';
export default interface IUserService {
    createAsync(value: UserCreateDTO): Promise<string>;
    updateAsync(id: string, value: UserUpdateDTO): Promise<string>;
    getAsync(query: UserPaginationQuery): Promise<PaginationResult<UserViewDTO>>;
    getByIdAsync(id: string): Promise<UserViewDTO>;
    changeStatusAsync(id: string, status: UserStatus): Promise<boolean>;
    changeRoleAsync(id: string, role: Role): Promise<boolean>;
    deleteAsync(id: string): Promise<boolean>;
}