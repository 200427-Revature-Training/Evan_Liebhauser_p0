import express from 'express';
import bodyParser from 'body-parser';
import { db } from './daos/db';
import { usersRouter } from './routers/users-router';
import { itemsRouter } from './routers/items-router';
import { collectionsRouter } from './routers/collections-router';

/* initialization parameters */

//these lines establish exprss as a required package and declares it
const app = express();

//these lines establish bodyparser as a required package and tell express to utilize it
app.use(bodyParser.json());

//feedback check to let me know the program is on-track at this point
console.log('begin');

// //pulling environment variable data from .env
// const {
//     NODE_APP_ROLE, NODE_APP_PASS, NODE_APP_URL
// } = process.env

// //sanity check that url was passed a value
// console.log(`${NODE_APP_URL || 'undefined'}`);

//checking for port setting and assigning a default port if it's undefined
const port = process.env.PORT || 3000;
app.set('port', port);

//feedback check
// console.log('establishing data structure')

/*
    ? Router Registration
*/
app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.use('/collections', collectionsRouter);


/* core data structure */

// this block creates a user array with an example user declared
// const users = [{
//     userName: 'Example User',
//     isCollecting: ['coins', 'cards', 'stamps'],
//     owns: ['penny', 'nickel', 'Ace'],
// }]

// // this block creates a collections array, using coins as a sample collection
// const collections = [{
//     collectionID: 'coins',
//     collectionItems: ['penny', 'nickel', 'dime', 'quarter'],
// }]

// // this block creates an item array, with a penny as a sample item
// const items = [{
//     itemID: 'penny',
//     partOf: 'coins',
// }]

process.on('unhandledRejection', () => {
    db.end().then(() => {
        console.log('Database pool closed');
    });
});

console.log('connect');


app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});

// console.log(exampleUser);
// console.log(coins);
// console.log(penny);
// console.log('fixedit');
