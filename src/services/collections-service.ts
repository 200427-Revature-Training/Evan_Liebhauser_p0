import { Collection } from '../models/Collection';
import * as collectionsDao from '../daos/collections-dao';

export function getAllCollections(): Promise<Collection[]> {
    // Apply internal business logic
    return collectionsDao.getAllCollections();
}

export function getCollectionById(id: number): Promise<Collection> {
    // Apply internal business logic
    return collectionsDao.getCollectionById(id);
}

export function getCollectionsByUserId(id: number): Promise<Collection[]> {
    // Apply internal business logic
    return collectionsDao.getCollectionsByUserId(id);
}

export function saveCollection(collection: any): Promise<Collection> {

    // Data from the user cannot be trusted
    const newCollection = new Collection(
        undefined, collection.collectionname, collection.collection_type
    );

    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(collection.collectionname) {
        // Data is valid - Continue submitting to DAO
        return collectionsDao.saveCollection(newCollection);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        console.warn('Invalid Data');
        console.log(`${collection.collectionname}`)
        return new Promise((resolve, reject) => reject(422));
    }
}


export function patchCollection(input: any): Promise<Collection> {

    const collection = new Collection(
        input.id, input.collectionname, input.collection_type
    );

    if (!collection.id) {
        throw new Error('400');
    }

    return collectionsDao.patchCollection(collection);

}

export function putCollection(input: any): Promise<Collection> {
    
    const collection = new Collection(
        input.id, input.collectionname, input.collection_type
    );
    
    if (!collection.id) {
        throw new Error('400');
    }

    return collectionsDao.putCollection(collection);
}

export function deleteCollection(id: number): Promise<number> {
    return collectionsDao.deleteCollection(id);
}