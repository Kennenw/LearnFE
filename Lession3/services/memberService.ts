import { Member } from "../entities/Member";
import { Generic } from "../generic";
import { AccountStatus, MemberType } from "../utils/enum";
import { write, writeCheck, writeNumber, writeNumberCheck } from "../utils/prompt"

export class MemberService {
    private generic: Generic<Member>;

    constructor(generic: Generic<Member>) {
        this.generic = generic;
    }

    addMember(): void {
        console.log("Nhập thông member");
        const id = this.generic.get().length + 1;
        const name = writeCheck("Nhập tên thành viên: ", "Tên thành viên");
        const phone = writeCheck("Nhập SĐT: ", "SĐT");
        const type = writeNumberCheck("Nhập loại thành viên(1.Sinh viên) (2.Giảng viên): ", "Loại thành viên", 1, 2);
        const memberType: MemberType = type === 1 ? MemberType.Student : MemberType.Teacher;
        this.generic.add(new Member(id, name, phone, memberType, AccountStatus.Active));
    }


    banMember(): void {
        const id = writeNumberCheck("Nhập ID thành viên bị ban: ", "ID thành viên");
        const member = this.generic.getById(id, "thành viên");
        if (member !== undefined) {
            member.accountStatus = AccountStatus.Locking;
            console.log("Ban thành viên thành công");
        }
    }

    getAllMember(): void {
        let list = this.generic.get();
        if (list.length)
            list.forEach(c => console.log(c.display()));
        else
            console.log("Không có thành viên nào");
    }

    editMemberByID(): void {
        const id = writeNumberCheck("Nhập ID thành viên cần cập nhật: ", "ID thành viên");
        const member = this.generic.getById(id, "thành viên");
        if (member !== undefined) {
            const name = write("Nhập tên thành viên: ");
            const phone = write("Nhập SĐT: ");
            const type = writeNumber("Nhập loại thành viên(1.Sinh viên) (2.Giảng viên): ", 1, 2);
            const newMemberEdit: Partial<Member> = {
                fullName: name,
                phone: phone,
            }
            if(type !== -1){
                newMemberEdit.memberType = (type === 1 ? MemberType.Student : MemberType.Teacher);
            }
            this.generic.edit(member, newMemberEdit);
        }
    }

    removeMember(): void{
        const id = writeNumberCheck("Nhập ID thành viên cần xóa: ", "ID thành viên");
        this.generic.remove(id)
    }

}
