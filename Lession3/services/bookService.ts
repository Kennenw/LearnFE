import { Generic } from "../generic";
import { writeNumber, writeCheck, writeNumberCheck, write } from "../utils/prompt";
import { Book } from "../entities/Book";
import { Category } from "../entities/Category";

export class BookService {
    private genericBook: Generic<Book>;
    private genericCateogry: Generic<Category>;

    constructor(genericBook: Generic<Book>, genericCateogry: Generic<Category>) {
        this.genericBook = genericBook;
        this.genericCateogry = genericCateogry;
    }

    addBook(): void {
        console.log("Nhập thông tin sách");
        const id = this.genericBook.get().length + 1;
        const title = writeCheck("Nhập tên sách: ", "Tên sách");
        const authorName = writeCheck("Nhập tác giả: ", "Tác giả");
        const publisher = writeCheck("Nhập nhà xuất bản: ", "NXB");
        const publicationYear = writeCheck("Nhập năm xuất bản: ", "Năm");
        const categoryID = writeNumberCheck("Nhập ID loại sách: ", "Loại sách");
        const categoryItem = this.genericCateogry.getById(categoryID, "loại sách");
        if (categoryItem !== undefined) {
            this.genericBook.add(new Book(id, title, authorName, categoryItem, publisher, publicationYear));
        }
    }

    removeBook(): void {
        const id = writeNumberCheck("Nhập id sách cần xóa: ", "ID sách");
        this.genericBook.remove(id);
    }

    getAllBook(): void {
        let list = this.genericBook.get();
        if (list.length)
            list.forEach(c => console.log(c.display()));
        else console.log("Không có item nào");
    }

    getBookByID(): Book | undefined {
        const id = writeNumberCheck("Nhập id sách cần tìm: ", "ID sách");
        return this.genericBook.getById(id, "sách");
    }

    editBookByID(): void {
        const item = this.getBookByID();
        if (item instanceof Book) {
            const title = write("Nhập tên sách: ");
            const authorName = write("Nhập tác giả: ");
            const publisher = write("Nhập nhà xuất bản: ");
            const publicationYear = write("Nhập năm xuất bản: ");
            const categoryID = writeNumber("Nhập ID loại sách: ");
            const newItemEdit: Partial<Book> = {
                title: title,
                authorName: authorName,
                publisher: publisher,
                publicationYear: publicationYear
            }
            if (categoryID !== -1) {
                const categoryItem = this.genericCateogry.getById(categoryID, "loại sách");
                if (categoryItem !== undefined) 
                    newItemEdit.category = categoryItem;
                else return;
            }
            this.genericBook.edit(item, newItemEdit);
        }
    }
}