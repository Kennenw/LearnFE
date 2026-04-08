import { Role } from "../../../core/enum/user";

export interface LoginDTO {
    userName: string,
    password: string
}

export interface LoginResponseDTO{
    role: Role;
}

export interface RegisterDTO {
    userName: string,
    password: string
}