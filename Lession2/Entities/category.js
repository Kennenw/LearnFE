class Category{
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    display(){
        return `ID: ${this.id} | Loại: ${this.name}`;
    }
}

module.exports = Category;