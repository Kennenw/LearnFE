import { Role } from "../../../core/enum/user";

export interface LoginDTO {
    userName: string,
    password: string
}

export interface LoginResponseDTO {
    id: string,
    userName: string,
    role: Role
}

export interface RegisterDTO {
    userName: string,
    password: string
}