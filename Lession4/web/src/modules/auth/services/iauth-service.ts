import { LoginDTO, LoginResponseDTO, RegisterDTO } from '../dtos/auth-dto';
export default interface IAuthService {
    login(value: LoginDTO): Promise<LoginResponseDTO>;
    register(value: RegisterDTO): Promise<boolean>
}