import { Member } from "./Member";
import { Book } from "./Book";

export class Loan {
    id: number;
    member: Partial<Member>;
    copy: Partial<Book>;
    quanlity: number;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    check?: boolean;

    constructor(
        id: number,
        member: Partial<Member>,
        copy: Partial<Book>,
        quanlity: number
    ) {
        this.id = id;
        this.member = member;
        this.copy = copy;
        this.quanlity = quanlity;
        this.borrowDate = new Date();
        this.dueDate = new Date();
        this.returnDate = null;
        this.check = false;
    }

    giveBack(): void {
        this.returnDate = new Date();
        this.check = true;
    }

    borrowTime(numberDay: number): void {
        const now = new Date();
        this.dueDate.setDate(now.getDate() + numberDay);
    }

    display(): string {
        return `Mã phiếu mượn: ${this.id}| Thành viên: [${this.member.id}] - ${this.member.fullName}| Sách: [${this.copy.id}] - ${this.copy.title}| SL: ${this.quanlity}| Ngày mượn: ${this.borrowDate.toDateString()}| Ngày trả theo hẹn: ${this.dueDate.toDateString()}| Ngày trả thực sự: ${this.returnDate?.toDateString()}| Trạng thái: ${this.check ? "Đã trả" : "Chưa trả"}`;
    }
}