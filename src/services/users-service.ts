import { User } from '../models/User';
import * as usersDao from '../daos/users-dao';

export function getAllUsers(): Promise<User[]> {
    // Apply internal business logic
    return usersDao.getAllUsers();
}

export function getUserById(id: number): Promise<User> {
    // Apply internal business logic
    return usersDao.getUserById(id);
}

// export function getUserByEmail(email: string): Promise<User> {
//     // Apply internal business logic
//     return usersDao.getUserByEmail(email);
// }

export function saveUser(user: any): Promise<User> {

    // Data from the user cannot be trusted
    const newUser = new User(
        undefined, user.username, user.email
    );

    if(user.id) {
        console.warn(`id ignored, apropriate id is generated automatically for new users`);
    }
    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(newUser.username && newUser.email) {
        // Feedback for dev
        console.log(user);
        // Data is valid - Continue submitting to DAO
        return usersDao.saveUser(newUser);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        console.warn('Invalid Data');
        console.log(`${user.username}, ${user.email}`)
        return new Promise((resolve, reject) => reject(422));
    }
}


export function patchUser(input: any): Promise<User> {

    const user = new User(
        input.id, input.username, input.email
    );

    if (!user.id) {
        console.warn(`invalid data: this operation requires a user id.`)
        return new Promise((resolve, reject) => reject(422));
    }

    return usersDao.patchUser(user);
}

export function putUser(input: any): Promise<User> {
    
    const user = new User(input.id, input.username, input.email);

    if (user.username && user.email) {
        if(!idTest(user)) {
            return usersDao.saveUser(user);
    }
        return usersDao.putUser(user);
    }
    console.warn(`invalid data: a user must have both username and email`)
    return new Promise((resolve, reject) => reject(422));
}

export function putUserAtId(input: any, id: number): Promise<User> {
    const user = new User(
        id, input.username, input.email
    );
    if (user.id && user.username && user.email) {
        return usersDao.putUserAtId(user);
    }
    console.warn('invalid data: a user must have both username and email');
    return new Promise((resolve, reject) => reject(422));
}

export function deleteUser(id: number): Promise<number> {
    return usersDao.deleteUser(id);
}

export function idTest(input: any) {
    const user = new User(input.id, undefined, undefined);
    if (user.id) {
        return(true);
    } else {
        return(false);
    }
}


// console.warn(`no user id supplied. saving ${body.username} as new user`);

// console.log(`user not found with id:${body.id}, saving as new user.`)
