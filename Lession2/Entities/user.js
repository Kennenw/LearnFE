const Generic = require("../generic");

class User {
    constructor(bool, name, bookInfors) {
        this.bool = bool;
        this.name = name;
        this.bookInfors = bookInfors;
    }

    display() {
        let rs = `${this.bool ? "MƯỢN" : "TRẢ"} | Tên: ${this.name} | ID sách đã mượn:`;
        this.bookInfors.forEach(b => {
            rs += ` ${b.bookId} | SL: ${b.quanlity} |`;
        })
        return rs;
    }
}

module.exports = User;