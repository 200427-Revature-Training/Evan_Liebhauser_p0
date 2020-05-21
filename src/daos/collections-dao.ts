/* istanbul ignore file */
import { db } from '../daos/db';
import { Collection, CollectionRow } from '../models/Collection';

/**
 * If we are using a one-off query for, we can just use db.query - it will have a connection
 * issue the query without having to pull it from the pool.
 *
 * query(sql, [params, ...]);
 */

export function getAllCollections(): Promise<Collection[]> {
    const sql = 'SELECT * FROM collections';

    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<CollectionRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<CollectionRow>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: CollectionRow[] = result.rows;

        console.log(rows);

        // 5. Convert row data format to Collection objects
        const collections: Collection[] = rows.map(row => Collection.from(row));
        return collections;
    });
}

export function getCollectionById(id: number): Promise<Collection> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM collections WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM collections WHERE id = $1';

    return db.query<CollectionRow>(sql, [id])
        .then(result => result.rows.map(row => Collection.from(row))[0]);
}

export function getCollectionsByUserId(id: number): Promise<Collection[]> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM collections WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = `SELECT collections.* FROM collections
    FULL JOIN collectors ON collectors.collection_id = collections.id
    WHERE collectors.owner_id = $1`;

    return db.query<CollectionRow>(sql, [id]).then(result => {
    const rows: CollectionRow[] = result.rows;

    console.log(rows);

    // 5. Convert row data format to Collection objects
    const collections: Collection[] = rows.map(row => Collection.from(row));
    return collections;
})};

export function saveCollection(collection: Collection): Promise<Collection> {
    const sql = `INSERT INTO collections (collectionname, collection_type) VALUES ($1, $2) RETURNING *`;

    return db.query<CollectionRow>(sql, [
        collection.collectionname,
        collection.collection_type
    ]).then(result => result.rows.map(row => Collection.from(row))[0]);
}

export async function patchCollection(collection: Collection): Promise<Collection> {
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'

    const sql = `UPDATE collections SET collectionname = COALESCE($1, collectionname), collection_type = COALESCE($2, collection_type) WHERE id = $3 RETURNING *`;

    // // if we call toISOString on undefined, we get a TypeError, since undefined
    // // is valid for patch, we guard operator to defend against calling
    // // .toISOString on undefined, allowing COALESCE to do its job
    // const birthdate = collection.birthdate && collection.birthdate.toISOString();

    const params = [collection.collectionname, collection.collection_type, collection.id];

    const result = await db.query<CollectionRow>(sql, params);
    return result.rows.map(row => Collection.from(row))[0];
}

export async function putCollection(collection: Collection): Promise<Collection> {
    
    const params = [collection.collectionname, collection.collection_type, collection.id];
    
    const existenceCheck: boolean = await collectionExists(collection.id);
    if (!existenceCheck) {
        return saveCollection(collection);
    
    } else {
        return patchCollection(collection);
    }
}

export async function deleteCollection(id: number): Promise<number> {
    const sql = `DELETE FROM collections WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return id;
}

export async function collectionExists(collectionId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT id FROM collections WHERE id = $1);`;
    const result = await db.query<Exists>(sql, [collectionId]);
    return result.rows[0].exists;
}

interface Exists {
    exists: boolean;
}