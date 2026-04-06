const Library = require("./library.js")
const prompt = require('prompt-sync')();

function PrintScreen() {
    let libary = new Library();
    showMenu(libary);
}

function showMenu(library) {
    console.log("\n===== MENU ===== \n" +
        "1. Tạo loại sách \n" +
        "2. Xem loại sách \n" +
        "3. Sửa loại sách \n" +
        "4. Xóa loại sách \n" +
        "5. Tạo sách \n" +
        "6. Xem sách \n" +
        "7. Sửa sách \n" +
        "8. Xóa sách \n" +
        "9. Mượn sách \n" +
        "10. Trả sách \n" +
        "11. Lịch sử người dùng \n" +
        "0. Thoát \n");
    let choose = prompt("Nhập hành động: ");
    switch (choose) {
        case "0":
            break;
        case "1": {
            console.log("Tạo loại sách")
            let name = prompt("Nhập loại sách: ");
            library.addCategory(name);
            showMenu(library);
            break;
        }
        case "2": {
            console.log("Loại sách")
            library.viewCategory();
            showMenu(library);
            break;
        }
        case "3": {
            let id = Number(prompt("Nhập id loại sách cần cập nhật: "));
            let check = library.categoryById(id);
            if (!check) break;
            let name = prompt("Nhập tên ");
            library.editCategory(id, name);
            showMenu(library);
            break;
        }
        case "4": {
            let id = Number(prompt("Nhập id loại sách cần xóa: "));
            library.deleteCategory(id);
            showMenu(library);
            break;
        }
        case "5": {
            console.log("Tạo sách")
            let title = prompt("Nhập tên sách: ");
            let quanlity = Number(prompt("Nhập số lượng sách: "));
            let categoryId = Number(prompt("Nhập id loại sách: "));
            library.addBook(title, quanlity, categoryId);
            showMenu(library);
            break;
        }
        case "6": {
            console.log("Sách")
            library.viewBook();
            showMenu(library);
            break;
        }
        case "7": {
            let id = Number(prompt("Nhập id sách cần cập nhật: "));
            let check = library.getBookId(id);
            if (!check) break;
            let data = {};
            let newTitle = prompt("Nhập tên sách mới(nếu cần): ");
            if (newTitle) data.title = newTitle;
            let newQuanlity = Number(prompt("Nhập số lượng sách mới(nếu cần): "));
            if (newQuanlity) data.quanlity = newQuanlity;
            let newCategoryId = prompt("Nhập id loại sách mới(nếu cần): ");
            if (newCategoryId && library.categoryById(newCategoryId)) data.newCategoryId = newCategoryId;
            library.editBook(id, data);
            showMenu(library);
            break;
        }
        case "8": {
            let id = Number(prompt("Nhập id sách cần xóa: "));
            library.deleteBook(id);
            showMenu(library);
            break;
        }
        case "9": {
            let name = prompt("Nhập tên người dùng: ");
            let borrowedBooks = [];
            let next = 0;
            do {
                let bookId = Number(prompt("Nhập ID sách cần mượn: "));
                let quanlity = Number(prompt("Số lượng cần mượn: "));
                if (library.checkExistQuanlity(bookId, quanlity)) {
                    borrowedBooks.push({ bookId, quanlity });
                }
                console.log("1. Để kết thúc, 2. Để tiếp tục thêm sách mượn");
                next = Number(prompt("Nhập hành động (1) (2): "))
            } while (next === 2);
            library.borrowBook(name, borrowedBooks);
            showMenu(library);
            break;
        } case "10": {
            let name = prompt("Nhập tên người dùng đã mượn: ");
            if (!library.checkUserBorrow(name)) {
                showMenu(library);
                break;
            }
            let giveBackBooks = [];
            let next = 0;
            do {
                let bookId = Number(prompt("Nhập ID sách trả: "));
                let quanlity = Number(prompt("Số lượng trả: "));
                if (library.checkExistQuanlity(bookId, quanlity)) {
                    giveBackBooks.push({ bookId, quanlity });
                }
                console.log("1. Để kết thúc, 2. Để tiếp tục thêm sách trả");
                next = Number(prompt("Nhập hành động (1) (2): "))
            } while (next === 2);
            library.giveBackBook(name, giveBackBooks);
            showMenu(library);
            break;
        } case "11": {
            console.log("Lịch sữ người dùng");
            library.viewUserBorrow();
            showMenu(library);
            break;
        }
        default:
            console.log("Lỗi");
            break;
    }
}

PrintScreen();