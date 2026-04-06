import { Book } from "../entities/Book";
import { Loan } from "../entities/Loan";
import { Member } from "../entities/Member";
import { Generic } from "../generic";
import { write, writeCheck, writeNumberCheck } from "../utils/prompt";

export class LoanService {
    private genericMember: Generic<Member>;
    private genericBook: Generic<Book>;
    private genericLoan: Generic<Loan>;

    constructor(genericMember: Generic<Member>, genericBook: Generic<Book>, genericLoan: Generic<Loan>) {
        this.genericMember = genericMember;
        this.genericBook = genericBook;
        this.genericLoan = genericLoan;
    }

    borrowBook() {
        const id = this.genericLoan.get().length + 1;
        const memInfo = writeCheck("Nhập ID hoặc tên người dùng cần mượn: ");
        let member: Member | undefined;
        if (typeof memInfo === "number") {
            member = this.genericMember.getById(memInfo);
            if (member === undefined) return;
        }
        if (typeof memInfo === "string") {
            member = this.genericMember.get().find(m => m.fullName === memInfo);
            if (member === undefined) return;
        }
        const bookInfo = writeCheck("Nhập ID hoặc tên tựa sách cần mượn: ");
        let book: Book | undefined;
        if (typeof bookInfo === "number") {
            book = this.genericBook.getById(bookInfo);
            if (book === undefined) return;
        }
        if (typeof bookInfo === "string") {
            book = this.genericBook.get().find(m => m.title === bookInfo);
            if (book === undefined) return;
        }
        if(member === undefined) return;
        if(book === undefined) return;
        const quanlity = writeNumberCheck("Nhập số lượng sách cần mượn: ");
        const quanlityBorrowDay = writeNumberCheck("Nhập số ngày mượn: ");
        const loan = new Loan(
            id,
            { id: member.id, fullName: member.fullName },
            { id: book.id, title: book.title },
            quanlity
        );
        loan.borrowTime(quanlityBorrowDay);
        this.genericLoan.add(loan);
    }
}