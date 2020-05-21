import { Item } from '../models/Item';
import * as itemsDao from '../daos/items-dao';
import { response } from 'express';

export function getAllItems(): Promise<Item[]> {
    // Apply internal business logic
    return itemsDao.getAllItems();
}

export function getItemById(id: number): Promise<Item> {
    // Apply internal business logic
    return itemsDao.getItemById(id);
}

// export function getItemByWorth(worth: string): Promise<Item> {
//     // Apply internal business logic
//     return itemsDao.getItemByWorth(worth);
// }

export function getItemsByUserId(id: number): Promise<Item[]> {
    //my business is illogical
    return itemsDao.getItemsByUserId(id);
}

export function saveItem(item: any): Promise<Item> {

    // Data from the user cannot be trusted
    const newItem = new Item(
        undefined, item.itemname, item.worth, undefined
    );

    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(newItem.itemname) {
        // Data is valid - Continue submitting to DAO
        return itemsDao.saveItem(newItem);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        console.warn('itemname required');
        console.log(item);
        console.log(`${item.itemname}, ${item.worth}, ${item.itemname}`);
        return new Promise((resolve, reject) => reject(422));
    }
}


export function patchItem(input: any): Promise<Item> {

    const item = new Item(
        input.id, input.itemname, input.worth, undefined
    );

    if (!item.id) {
        console.warn('id required for PATCH');
        return new Promise((resolve, reject) => reject(422));
    }

    return itemsDao.patchItem(item);

}

export function putItem(input: any): Promise<Item> {
    
    const item = new Item(
        input.id, input.itemname, input.worth, undefined
    );
    if (!item.id) {
        console.warn('id required for PUT');
        return new Promise((resolve, reject) => reject(422));
    }
    return itemsDao.putItem(item);
}

export function deleteItem(id: number): Promise<number> {
    return itemsDao.deleteItem(id);
}