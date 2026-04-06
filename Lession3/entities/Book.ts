import { Category } from "./Category";
export class Book {
    id : number;
    title: string;
    authorName: string;
    publisher: string;
    publicationYear: string;
    category: Category;


    constructor(id:number, title: string, authorName:string, category: Category, publisher: string,publicationYear:string){
        this.id = id;
        this.title = title;
        this.authorName = authorName;
        this.category = category;
        this.publisher = publisher;
        this.publicationYear = publicationYear;
    }

    display(): string {
        return `Sách [${this.id}] - ${this.title}
            Tác giả: ${this.authorName}
            Danh mục: [${this.category.id}] - ${this.category.name}
            Nhà xuất bản: ${this.publisher}
            Năm xuất bản: ${this.publicationYear}`;
    }
}