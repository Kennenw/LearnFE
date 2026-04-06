import { Book } from "./entities/Book";
import { Category } from "./entities/Category";
import { Loan } from "./entities/Loan";
import { Member } from "./entities/Member";
import { AccountStatus, MemberType } from "./utils/enum";

export const listCategorys: Category[] = [
    new Category(1, "Công nghệ"),
    new Category(2, "Kinh tế"),
    new Category(3, "Văn học"),
    new Category(4, "Lịch sử"),
    new Category(5, "Khoa học")
];

export const listBooks: Book[] = [
    new Book(1, "JavaScript cơ bản", "Nguyễn Văn A", listCategorys[0], "NXB Trẻ", "2020", 22),
    new Book(2, "React nâng cao", "Trần Văn B", listCategorys[0], "NXB Thanh Niên", "2022", 12),
    new Book(3, "Kinh tế vi mô", "Lê Văn C", listCategorys[1], "NXB Giáo Dục", "2019", 23),
    new Book(4, "Dế Mèn phiêu lưu ký", "Tô Hoài", listCategorys[2], "NXB Kim Đồng", "2015", 45),
    new Book(5, "Lịch sử Việt Nam", "Nguyễn Trường", listCategorys[3], "NXB Giáo Dục", "2018", 30),
    new Book(6, "Vật lý cơ bản", "Trần Minh", listCategorys[4], "NXB Khoa Học", "2021", 20),
    new Book(7, "Toán nâng cao", "Lê Thị Hoa", listCategorys[4], "NXB Khoa Học", "2020", 15),
    new Book(8, "Truyện Kiều", "Nguyễn Du", listCategorys[2], "NXB Văn Học", "2014", 50)
];

export const listMembers: Member[] = [
    new Member(1, "Nguyễn Văn Nam", "0123456789", MemberType.Student, AccountStatus.Active),
    new Member(2, "Trần Thị Lan", "0987654321", MemberType.Teacher, AccountStatus.Active),
    new Member(3, "Lê Văn Hùng", "0111222333", MemberType.Student, AccountStatus.Locking),
    new Member(4, "Phạm Văn Dũng", "0999888777", MemberType.Student, AccountStatus.Active),
    new Member(5, "Hoàng Thị Mai", "0888777666", MemberType.Teacher, AccountStatus.Active),
    new Member(6, "Nguyễn Văn Tèo", "0777666555", MemberType.Student, AccountStatus.Locking)
];

export const listLoans: Loan[] = [
    new Loan(
        1,
        { id: listMembers[0].id, fullName: listMembers[0].fullName },
        { id: listBooks[0].id, title: listBooks[0].title },
        1
    ),
    new Loan(
        2,
        { id: listMembers[1].id, fullName: listMembers[1].fullName },
        { id: listBooks[2].id, title: listBooks[2].title },
        2
    ),
    new Loan(
        3,
        { id: listMembers[3].id, fullName: listMembers[3].fullName },
        { id: listBooks[1].id, title: listBooks[1].title },
        1
    ),
    new Loan(
        4,
        { id: listMembers[4].id, fullName: listMembers[4].fullName },
        { id: listBooks[3].id, title: listBooks[3].title },
        2
    ),
    new Loan(
        5,
        { id: listMembers[5].id, fullName: listMembers[5].fullName },
        { id: listBooks[5].id, title: listBooks[5].title },
        1
    )
];