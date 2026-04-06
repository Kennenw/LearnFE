import { Book } from "../entities/Book";
import { Loan } from "../entities/Loan";
import { Member } from "../entities/Member";
import { Generic } from "../generic";
import { AccountStatus } from "../utils/enum";
import { writeCheck, writeNumberCheck } from "../utils/prompt";

export class LoanService {
    private genericMember: Generic<Member>;
    private genericBook: Generic<Book>;
    private genericLoan: Generic<Loan>;

    constructor(genericMember: Generic<Member>, genericBook: Generic<Book>, genericLoan: Generic<Loan>) {
        this.genericMember = genericMember;
        this.genericBook = genericBook;
        this.genericLoan = genericLoan;
    }

    borrowBook(): void {
        const id = this.genericLoan.get().length + 1;
        const memInfo = writeCheck("Nhập ID hoặc tên người dùng cần mượn: ");
        let member: Member | undefined;
        const memID = Number(memInfo);
        if (!isNaN(memID)) {
            member = this.genericMember.getById(memID);
            if (member === undefined) return;
        } else {
            member = this.genericMember.get().find(m => m.fullName === memInfo);
            if (member === undefined) return;
        }
        if (member.accountStatus === AccountStatus.Locking) {
            console.log("Thành viên đã bị ban không cho mượn");
            return;
        }
        const bookInfo = writeCheck("Nhập ID hoặc tên tựa sách cần mượn: ");
        let book: Book | undefined;
        const bookID = Number(bookInfo);
        if (!isNaN(bookID)) {
            book = this.genericBook.getById(bookID);
            if (book === undefined) return;
        } else {
            book = this.genericBook.get().find(m => m.title === bookInfo);
            if (book === undefined) return;
        }
        if (member === undefined) return;
        if (book === undefined) return;
        const quanlity = writeNumberCheck("Nhập số lượng sách cần mượn: ");
        const quanlityBorrowDay = writeNumberCheck("Nhập số ngày mượn: ");
        const loan = new Loan(
            id,
            { id: member.id, fullName: member.fullName },
            { id: book.id, title: book.title },
            quanlity
        );
        loan.borrowTime(quanlityBorrowDay);
        book.quanlity -= quanlity;
        this.genericLoan.add(loan);
    }

    giveBackBook(): void {
        const loanId = writeNumberCheck("Nhập ID phiếu mượn: ", "ID phiếu mượn");
        const item = this.genericLoan.getById(loanId, "phiếu mượn");
        if (item === undefined) return;
        const book = this.genericBook.get().find(b => b.id === item.copy.id || b.title === item.copy.title);
        if (book === undefined) return;
        book.quanlity += item.quanlity;
        item.giveBack();
    }

    getAllLoan(): void {
        let list = this.genericLoan.get();
        if (list.length)
            list.forEach(c => console.log(c.display()));
        else console.log("Không có item nào");
    }

    getLoanByMemberID(): void {
        const memberID = writeNumberCheck("Nhập ID thành viên: ", "ID thành viên");
        let list = this.genericLoan.get().filter(l => l.member.id === memberID);
        if (list.length)
            list.forEach(c => console.log(c.display()));
        else console.log("Không có item nào");
    }
}