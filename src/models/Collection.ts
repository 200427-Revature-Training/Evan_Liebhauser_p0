export class Collection {
    id: number;
    collectionname: string;
    collection_type: string;

    /**
     * Static function for creating a Collection instance from the structure the database gives us
     */

    static from(obj: CollectionRow): Collection {
        const collection = new Collection (
            obj.id, obj.collectionname, obj.collection_type
        );
        return collection;
    }

    constructor(id: number, collectionname: string, collection_type: string) {
        this.id = id;
        this.collectionname = collectionname;
        this.collection_type = collection_type;
    }
}

    /* Alternatively use this without property declaration */
    // constructor (private id: number, private collectionname: string,
    //              private lastName: string, private birthdate: Date) {
    // }

export interface CollectionRow {
    id: number;
    collectionname: string;
    collection_type: string;
}