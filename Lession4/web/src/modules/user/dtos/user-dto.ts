import { Role, UserStatus } from "../../../core/enum/user";
import User from "../models/user";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserViewDTO extends Omit<User, 'password'> {

}

export interface UserCreateDTO {
    userName: string;
    password: string;
    role: Role;
    status: UserStatus;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserUpdateDTO extends Partial<UserCreateDTO> {


}

export function toUserViewDTO(value: User): UserViewDTO {
    return {
        id: value.id,
        role: value.role,
        status: value.status,
        userName: value.userName
    }
}
