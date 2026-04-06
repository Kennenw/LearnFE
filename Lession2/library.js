const Category = require("./entities/category");
const Generic = require("./generic");
const Book = require("./entities/book");
const User = require("./entities/user");

class Library {
    constructor() {
        this.book = [
            new Book(1, "JavaScript cơ bản", 10, 1),
            new Book(2, "React nâng cao", 5, 1),
            new Book(3, "Kinh tế vi mô", 7, 2),
            new Book(4, "Doraemon", 20, 3),
        ];

        this.category = [
            new Category(1, "Lập trình"),
            new Category(2, "Kinh tế"),
            new Category(3, "Tiểu thuyết"),
        ];

        this.user = [
            new User(true, "Phúc", [
                { bookId: 1, quanlity: 2 },
                { bookId: 4, quanlity: 1 },
            ]),
            new User(false, "An", [
                { bookId: 4, quanlity: 1 },
            ]),
        ];
    }

    viewUserBorrow() {
        this.user.forEach((u) => console.log(u.display()));
    }

    checkExistQuanlity(bookId, quanlity) {
        let result = this.book.filter(
            (b) => b.id === bookId && b.quanlity <= quanlity,
        );
        if (result.length) return 1;
        console.log("Sách không tìm thấy hoặc số lượng không đủ");
        return 0;
    }

    borrowBook(name, userInfor) {
        Generic.add(
            this.user,
            "Người dùng mượn sách",
            new User(true, name, userInfor),
        );
        let borrow = new Map(userInfor.map((b) => [b.bookId, b.quanlity]));
        this.book.forEach((b) => {
            let quanlity = borrow.get(b.id);
            if (quanlity) b.quanlity -= quanlity;
        });
    }

    checkUserBorrow(name) {
        let user = this.user.filter((u) => u.name === name);
        if (user.length) return 1;
        console.log("Không tìm thấy người dùng này");
        return 0;
    }

    giveBackBook(name, userInfor) {
        Generic.add(
            this.user,
            "Người dùng trả sách",
            new User(false, name, userInfor),
        );
        let borrow = new Map(userInfor.map((b) => [b.bookId, b.quanlity]));
        this.book.forEach((b) => {
            b.quanlity += borrow.get(b.id);
        });
    }

    viewCategory() {
        if (!this.category.length) console.log("Không có loại sách nào");
        this.category.forEach((c) => {
            console.log(c.display());
        });
    }

    addCategory(name) {
        let id = this.category.length + 1;
        Generic.add(
            this.category,
            "Loại sách",
            new Category((id = id), (name = name)),
        );
    }

    editCategory(id, name) {
        Generic.handleById(
            id,
            this.category,
            { name: name },
            "loại sách",
            Generic.edit,
        );
    }

    categoryById(id) {
        return Generic.handleById(id, this.category, null, null, (item) => {
            console.log(item.display());
        });
    }

    deleteCategory(id) {
        Generic.handleById(id, this.category, null, "loại sách", (item, title) => {
            let check = this.book.filter((b) => b.categoryId === item.id)
            if (check.length) {
                console.log("Có sách thuộc loại sách này, không thể xóa");
                return;
            }
            Generic.delete(item.id, this.category, title);
        });
    }

    viewBook() {
        if (!this.book.length) console.log("Không có sách nào");
        this.book.forEach((b) => {
            console.log(b.display());
        });
    }

    addBook(title, quanlity, categoryId) {
        let id = this.book.length + 1;
        let check = Generic.handleById(
            categoryId,
            this.category,
            null,
            "loại sách",
        );
        if (!check) {
            console.log("Tạo sách thất bại");
            return;
        }
        Generic.add(
            this.book,
            "Sách",
            new Book(
                (id = id),
                (title = title),
                (quanlity = quanlity),
                (categoryId = categoryId),
            ),
        );
    }

    editBook(id, data) {
        Generic.handleById(id, this.book, data, "sách", Generic.edit);
    }

    getBookId(id) {
        return Generic.handleById(id, this.book, null, "sách", (item) => {
            console.log(item.display());
        });
    }

    deleteBook(id) {
        Generic.handleById(id, this.book, null, "sách", (item, title) => {
            let check = this.user.filter(u => {
                u.bookInfors.filter(b => b.bookId === item.id)
            });
            if (check.length) {
                console.log("Có người mượn sách này không thể xóa");
                return;
            }
            Generic.delete(item.id, this.book, title);
        });
    }
}

module.exports = Library;
