import BaseEntity from "../../../core/base/base-entity";

export default class Brand extends BaseEntity {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
}