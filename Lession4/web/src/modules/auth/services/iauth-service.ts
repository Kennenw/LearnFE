import { LoginDTO, LoginResponseDTO, RegisterDTO } from '../dtos/auth-dto';
export default interface IAuthService {
    loginAsync(value: LoginDTO): Promise<LoginResponseDTO>;
    registerAsync(value: RegisterDTO): Promise<boolean>
}