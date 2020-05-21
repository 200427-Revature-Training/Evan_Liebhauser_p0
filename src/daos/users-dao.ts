/* istanbul ignore file */
import { db } from '../daos/db';
import { User, UserRow } from '../models/User';

/**
 * If we are using a one-off query for, we can just use db.query - it will have a connection
 * issue the query without having to pull it from the pool.
 *
 * query(sql, [params, ...]);
 */

export async function getAllUsers(): Promise<User[]> {
    const sql = 'SELECT * FROM users';

    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<UserRow>
    // 3. We can react to the database response by chaining a .then onto the query
    const result = await db.query<UserRow>(sql, []);
    // 4. Extract rows from the query response
    const rows: UserRow[] = result.rows;
    console.log(rows);
    // 5. Convert row data format to User objects
    const users: User[] = rows.map(row => User.from(row));
    return users;
}

export async function getUserById(id: number): Promise<User> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM users WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = `SELECT * FROM users WHERE id = $1`;

    const result = await db.query<UserRow>(sql, [id]);
    return result.rows.map(row => User.from(row))[0];
}

export async function getUsersByItemId(id: number): Promise<User[]> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM users WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = `SELECT users.* FROM users
    FULL JOIN possessions ON users.id = possessions.owner_id
    WHERE item_id = $1;`;

    const result = await db.query<UserRow>(sql, [id]);
    // 4. Extract rows from the query response
    const rows: UserRow[] = result.rows;

    // 5. Convert row data format to User objects
    const users: User[] = rows.map(row => User.from(row));
    return users;
}

export async function getUsersByCollectionId(id: number): Promise<User[]> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM users WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = `SELECT users.* FROM users
    FULL JOIN collectors ON users.id = collectors.owner_id
    WHERE collection_id = $1;`;

    const result = await db.query<UserRow>(sql, [id]);
    // 4. Extract rows from the query response
    const rows: UserRow[] = result.rows;

    // 5. Convert row data format to User objects
    const users: User[] = rows.map(row => User.from(row));
    return users;
}

export async function saveUser(user: User): Promise<User> {
    const sql = `INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *`;
    return db.query<UserRow>(sql, [
        user.username,
        user.email,
    ]).then(result => result.rows.map(row => User.from(row))[0]);
}


export async function patchUser(user: User): Promise<User> {
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'

    const sql = `UPDATE users SET username = COALESCE($1, username), \
    email = COALESCE($2, email) WHERE id = $3 RETURNING *`;

    // // if we call toISOString on undefined, we get a TypeError, since undefined
    // // is valid for patch, we guard operator to defend against calling
    // // .toISOString on undefined, allowing COALESCE to do its job
    // const birthdate = user.birthdate && user.birthdate.toISOString();

    const params = [user.username, user.email, user.id];

    const result = await db.query<UserRow>(sql, params);
    return result.rows.map(row => User.from(row))[0];
}

export async function putUser(user: User): Promise<User> {
    const sql = `UPDATE users SET username = COALESCE($1, username), \
    email = COALESCE($2, email) WHERE id = $3 RETURNING *`

    const params = [user.username, user.email, user.id];

    const result = await db.query<UserRow>(sql, params);
    return result.rows.map(row => User.from(row))[0];
}

export async function putUserAtId(user: User): Promise<User> {
    
    const params = [user.username, user.email, user.id];
    
    // const existenceCheck: boolean = await userExists(user.id);
    // if (!existenceCheck) {
    //     return saveUser(user);
    
    // } else {
    //     return patchUser(user);
    // }

    const sql = `UPDATE users SET username = COALESCE($1, username), \
    email = COALESCE($2, email) WHERE id = $3 RETURNING *`;

    return db.query<UserRow>(sql, params)
        .then(result => result.rows.map(row => User.from(row))[0]);
}

export async function deleteUser(id: number): Promise<number> {
    const sql = `DELETE FROM users WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return id;
}

//may 14th asynch functions

// export async function getCollectionsByUserId(userId: number): Promise<Collection[]> {
//     const sql = `SELECT collections.* FROM collectors \
//     LEFT JOIN collections ON collectors.user_id WHERE people_id = $1`;

//     const result = await db.query<Collection>(sql, [userId]);
//     return result.rows;
// }

export async function userExists(userId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT id FROM users WHERE id = $1);`;
    const result = await db.query<Exists>(sql, [userId]);
    return result.rows[0].exists;
}

interface Exists {
    exists: boolean;
}