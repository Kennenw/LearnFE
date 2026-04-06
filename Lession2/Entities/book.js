class Book{
    constructor(id, title, quanlity, categoryId){
        this.id = id;
        this.title = title;
        this.quanlity = quanlity;
        this.categoryId = categoryId;
    }

    display() {
        return `ID: ${this.id} | Tên: ${this.title} | SL: ${this.quanlity} | ID Loại Sách: ${this.categoryId} `;
    }
}

module.exports = Book;