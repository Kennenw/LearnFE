import BaseEntity from "../../../core/base/base-entity";

export default class Category extends BaseEntity {
    name: string;
    parentId: string |  undefined;
    constructor(name: string, parentId?: string){
        super();
        this.name = name;
        this.parentId = parentId;
    }
}