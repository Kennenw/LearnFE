import { Category } from "./entities/Category";
import { Book } from "./entities/Book";
import { Generic } from "./generic";
import { Menu } from "./menu";
import { CategoryService } from "./services/categoryService";
import { BookService } from "./services/bookService";
import { Member } from "./entities/Member";
import { MemberService } from "./services/memberService";
import { Loan } from "./entities/Loan";
import { LoanService } from "./services/loanService";
import { listBooks, listCategorys, listLoans, listMembers } from "./data";

function Index(): void {
    let listCateogry: Category[] = listCategorys;
    let listBook: Book[] = listBooks;
    let listMember: Member[] = listMembers;
    let listLoan: Loan[] = listLoans;
    let categoryGeneric: Generic<Category> = new Generic<Category>(listCateogry);
    let bookGeneric: Generic<Book> = new Generic<Book>(listBook);
    let memberGeneric: Generic<Member> = new Generic<Member>(listMember);
    let loanGeneric: Generic<Loan> = new Generic<Loan>(listLoan);
    let categories: CategoryService = new CategoryService(categoryGeneric);
    let books: BookService = new BookService(bookGeneric, categoryGeneric);
    let members: MemberService = new MemberService(memberGeneric);
    let loans: LoanService = new LoanService(memberGeneric, bookGeneric, loanGeneric);
    const menu = new Menu(categories, books, members, loans);
    menu.display();
}

Index();