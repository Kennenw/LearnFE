import { Role, UserStatus } from "../../../core/enum/user";
import BaseEntity from "../../../core/base/base-entity";

export default class User extends BaseEntity {
    userName: string;
    password: string;
    role: Role;
    status: UserStatus;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
        this.role = Role.Customer;
        this.status = UserStatus.Active;
    }
}