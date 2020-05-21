/* istanbul ignore file */
import { db } from '../daos/db';
import { Item, ItemRow } from '../models/Item';

/**
 * If we are using a one-off query for, we can just use db.query - it will have a connection
 * issue the query without having to pull it from the pool.
 *
 * query(sql, [params, ...]);
 */

export function getAllItems(): Promise<Item[]> {
    const sql = `SELECT items.id, items.itemname, items.worth, collections.collectionname \
    FROM items \
    FULL JOIN item_sets ON item_sets.item_id = items.id \
    FULL JOIN collections ON item_sets.collection_id = collections.id \
    WHERE items.id IS NOT NULL`;

    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<ItemRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<ItemRow>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: ItemRow[] = result.rows;

        console.log(rows);

        // 5. Convert row data format to Item objects
        const items: Item[] = rows.map(row => Item.from(row));
        return items;
    });
}

export function getItemById(id: number): Promise<Item> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM items WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = `SELECT items.id, items.itemname, items.worth, collections.collectionname \
    FROM items \
    FULL JOIN item_sets ON item_sets.item_id = items.id \
    FULL JOIN collections ON item_sets.collection_id = collections.id \
    WHERE items.id = $1`;

    return db.query<ItemRow>(sql, [id])
        .then(result => result.rows.map(row => Item.from(row))[0]);
}

export function getItemsByUserId(id: number): Promise<Item[]> {
    
    const sql = `SELECT items.* FROM items
    FULL JOIN possessions ON items.id = possessions.item_id 
    WHERE owner_id = $1`;

    return db.query<ItemRow>(sql, [id]).then(result => {
        // 4. Extract rows from the query response
        const rows: ItemRow[] = result.rows;

        console.log(rows);

        // 5. Convert row data format to Item objects
        const items: Item[] = rows.map(row => Item.from(row));
        return items;
});
};

export function saveItem(item: Item): Promise<Item> {
    const sql = `INSERT INTO items (itemname, worth) VALUES ($1, $2) RETURNING *`;

    return db.query<ItemRow>(sql, [
        item.itemname,
        item.worth
    ]).then(result => result.rows.map(row => Item.from(row))[0]);
}

export async function patchItem(item: Item): Promise<Item> {

    const sql = `UPDATE items SET itemname = COALESCE($1, itemname), \
    worth = COALESCE($2, worth) WHERE id = $3 RETURNING *`;

    const params = [item.itemname, item.worth, item.id];

    const result = await db.query<ItemRow>(sql, params);
    return result.rows.map(row => Item.from(row))[0];
}

export async function putItem(item: Item): Promise<Item> {
    
    const params = [item.itemname, item.worth, item.id];
    
    const existenceCheck: boolean = await itemExists(item.id);
    if (!existenceCheck) {
        console.log('Item id not found, saved as new item');
        return saveItem(item);
    
    } else {
        console.log('Item id found, ')
        return patchItem(item);
    }
}

export async function deleteItem(id: number): Promise<number> {
    const sql = `DELETE FROM items WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return id;
}

export async function itemExists(itemId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT id FROM items WHERE id = $1);`;
    const result = await db.query<Exists>(sql, [itemId]);
    return result.rows[0].exists;
}

interface Exists {
    exists: boolean;
}