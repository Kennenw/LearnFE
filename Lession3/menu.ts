import { listLoans } from './data';
import { BookService } from "./services/bookService";
import { CategoryService } from "./services/categoryService";
import { writeNumberCheck } from "./utils/prompt";
import { MemberService } from "./services/memberService";
import { LoanService } from "./services/loanService";

export class Menu {

    private categoryService: CategoryService;
    private bookService: BookService;
    private memberService: MemberService;
    private loanService: LoanService;

    constructor(categoryService: CategoryService, bookService: BookService, memberService: MemberService, loanService: LoanService) {
        this.categoryService = categoryService;
        this.bookService = bookService;
        this.memberService = memberService;
        this.loanService = loanService;
    }

    display(): void {
        let choose: number = 0;
        do {
            console.log(` ===== MENU =====
                            1. Tạo loại sách
                            2. Xem loại sách
                            3. Sửa loại sách
                            4. Xóa loại sách
                            5. Tạo sách
                            6. Xem sách
                            7. Sửa sách
                            8. Xóa sách
                            9. Tạo thành viên
                            10. Xem thành viên
                            11. Sửa thành viên
                            12. Khóa thành viên
                            13. Bỏ khóa thành viên
                            14. Xóa thành viên
                            15. Mượn sách
                            16. Trả sách
                            17. Lịch sử mượn
                            18. Lịch sử mượn theo người dùng
                            0. Thoát`);
            choose = writeNumberCheck("Nhập hành động: ", "Lựa chọn");
            switch (choose) {
                case 0:
                    break;
                case 1:
                    this.categoryService.addCategory();
                    break;
                case 2:
                    this.categoryService.getAllCategory();
                    break;
                case 3:
                    this.categoryService.editCategoryByID();
                    break;
                case 4:
                    this.categoryService.removeCategory();
                    break;
                case 5:
                    this.bookService.addBook();
                    break;
                case 6:
                    this.bookService.getAllBook();
                    break;
                case 7:
                    this.bookService.editBookByID();
                    break;
                case 8:
                    this.bookService.removeBook();
                    break;
                case 9:
                    this.memberService.addMember();
                    break;
                case 10:
                    this.memberService.getAllMember();
                    break;
                case 11:
                    this.memberService.editMemberByID();
                    break;
                case 12:
                    this.memberService.banMember();
                    break;
                case 13:
                    this.memberService.unBanMember();
                    break;
                case 14:
                    this.memberService.removeMember();
                    break;
                case 15:
                    this.loanService.borrowBook();
                    break;
                case 16:
                    this.loanService.giveBackBook();
                    break;
                case 17:
                    this.loanService.getAllLoan();
                    break;
                case 18:
                    this.loanService.getLoanByMemberID();
                    break;
                default:
                    console.log("Lỗi");
                    break;
            }
        } while (choose !== 0);
    };
}
