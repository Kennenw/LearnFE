import { Role, UserStatus } from "../types/user";

export default class User {
    id: number;
    userName: string;
    password: string;
    role: Role;
    status: UserStatus;

    constructor(id:number, userName: string, password: string){
        this.id = id;
        this.userName = userName;
        this.password = password;
        this.role = Role.Customer;
        this.status = UserStatus.Active;
    }

    setRole(role: Role){
        this.role = role;
    }
}