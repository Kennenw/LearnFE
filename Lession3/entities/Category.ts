export class Category{
    id:number;
    name: string;
    
    constructor(id: number, name:string){
        this.id = id;
        this.name = name;
    }
    
    display(): string{
        return `ID: ${this.id} | Loại ${this.name}`;
    }
}