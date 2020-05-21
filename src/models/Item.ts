export class Item {
    id: number;
    itemname: string;
    worth: number;
    collectionname: string;

    /**
     * Static function for creating a User instance from the structure the database gives us
     */

    static from(obj: ItemRow): Item {
        const item = new Item (
            obj.id, obj.itemname, obj.worth, obj.collectionname
        );
        return item;
    }

    constructor(id: number, itemname: string, worth: number, collectionname: string) {
        this.id = id;
        this.itemname = itemname;
        this.worth = worth;
        this.collectionname = collectionname;
    }
}

    /* Alternatively use this without property declaration */
    // constructor (private id: number, private itemname: string,
    //              private lastName: string, private birthdate: Date) {
    // }

export interface ItemRow {
    id: number;
    itemname: string;
    worth: number;
    collectionname: string;
}