export class User {
    id: number;
    username: string;
    email: string;

    /**
     * Static function for creating a User instance from the structure the database gives us
     */

    static from(obj: UserRow): User {
        const user = new User (
            obj.id, obj.username, obj.email
        );
        return user;
    }

    constructor(id: number, username: string, email: string) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

    /* Alternatively use this without property declaration */
    // constructor (private id: number, private username: string,
    //              private lastName: string, private birthdate: Date) {
    // }

export interface UserRow {
    id: number;
    username: string;
    email: string;
}

// //Possessions Block
// export class UserPossessions {
//     possessionArray: object;

//     static from (obj: PossessionList): UserPossessions {
//         const userPossessions = new UserPossessions (obj.possessionArray);
//         return userPossessions;
//     }

//     constructor(possessionArray: []) {
//         this.possessionArray = possessionArray;
//     }
// }

// export interface PossessionList {
//     possessionArray: [];
// }

// //Collections Block
// export class UserCollections {
//     collectionArray: [];

//     static from (obj: CollectionList): UserCollections {
//         const userCollections = new UserCollections (obj.collectionArray);
//         return userCollections;
//     }

//     constructor(collectionArray: []) {
//         this.collectionArray = collectionArray;
//     }
// }

// export interface CollectionList {
//     collectionArray: [];
// }

// export class ExtendedUser {
//     id: number;
//     username: string;
//     email: string;
//     collArr: [];
//     itemArr: [];

//     /**
//      * Static function for creating a User instance from the structure the database gives us
//      */

//     static from(obj: ExtendedUserRow): ExtendedUser {
//         const extendedUser = new ExtendedUser (
//             obj.id, obj.username, obj.email,  obj.collArr, obj.itemArr
//         );
//         return extendedUser;
//     }

//     constructor(id: number, username: string, email: string, collArr: [], itemArr: []) {
//         this.id = id;
//         this.username = username;
//         this.email = email;
//         this.collArr = collArr;
//         this.itemArr = itemArr;
//     }
// }

//     /* Alternatively use this without property declaration */
//     // constructor (private id: number, private username: string,
//     //              private lastName: string, private birthdate: Date) {
//     // }

// export interface ExtendedUserRow {
//     id: number;
//     username: string;
//     email: string;
//     collArr: [];
//     itemArr: [];
// }