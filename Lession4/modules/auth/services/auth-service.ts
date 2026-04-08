import User from '../../user/models/user';
import { LoginDTO, LoginResponseDTO, RegisterDTO } from './../dtos/auth-dto';
import IAuthService from './iauth-service';
import IGenericRepository from '../../../core/interfaces/igeneric-repository';
import { UserStatus } from '../../../core/enum/user';

export default class AuthService implements IAuthService {
    private userRepo: IGenericRepository<User>;
    constructor(userRepo: IGenericRepository<User>) {
        this.userRepo = userRepo;
    }

    async login(value: LoginDTO): Promise<LoginResponseDTO> {
        const result = await this.userRepo.getAsync(undefined, undefined, (query) => {
            return query.eq('userName', value.userName)
                .eq('status', UserStatus.Active);
        });
        const user = result.data[0];
        if (!user) return Promise.reject(Error('Đăng nhập thất bại'));
        if (user.password !== value.password) {
            return Promise.reject(Error('Đăng nhập thất bại'));
        }
        return { role: user.role };
    }

    async register(value: RegisterDTO): Promise<boolean> {
        const result = await this.userRepo.getAsync(undefined, undefined, (query) => {
            return query.eq('userName', value.userName)
                .eq('status', UserStatus.Active);
        });
        const user = result.data[0];
        if (user) return Promise.reject(Error('Lỗi trùng tên trong hệ thông'));
        await this.userRepo.addAsync(new User(value.userName, value.password));
        return true;
    }

}