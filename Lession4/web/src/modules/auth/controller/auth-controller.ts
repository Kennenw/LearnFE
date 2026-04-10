import GenericRepository from "@infrastructure/database/repositories/generic-repository";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import User from "@modules/user/models/user";
import { LoginDTO, RegisterDTO } from "../dtos/auth-dto";
import IAuthService from "../services/iauth-service";
import AuthService from "../services/auth-service";

const userRepo: IGenericRepository<User> = new GenericRepository<User>('users');
const authService: IAuthService = new AuthService(userRepo);

export const AuthController = {
    async login(data: LoginDTO) {
        const result = await authService.loginAsync(data);
        localStorage.setItem('user-name', result.userName);
        localStorage.setItem('id', result.id);
        localStorage.setItem('role', result.role);
        return result;
    },

    async register(data: RegisterDTO) {
        return await authService.registerAsync(data);
    }
};
