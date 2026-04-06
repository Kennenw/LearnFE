import { MemberType, AccountStatus } from "../utils/enum";

export class Member {
    id: number;
    fullName: string;
    phone: string;
    memberType: MemberType;
    accountStatus: AccountStatus;

    constructor(
        id: number,
        fullName: string,
        phone: string,
        memberType: MemberType,
        accountStatus: AccountStatus
    ) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.memberType = memberType;
        this.accountStatus = accountStatus;
    }

    display(): string {
        return `Thành viên [${this.id}]| Họ tên: ${this.fullName}| Số điện thoại: ${this.phone}| Loại thành viên: ${this.memberType}| Trạng thái: ${this.accountStatus}`;
    }
}