import express from 'express';
import * as usersService from '../services/users-service';
import * as usersDao from '../daos/users-dao';
import e from 'express';


export const usersRouter = express.Router();

/*
    GET http://localhost:3000/users
    Retrieves an array of users from database
*/
usersRouter.get('', (request, response, next) => {
    usersService.getAllUsers().then(users => {
        response.json(users);
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
    });
});

/*
    GET http://localhost:3000/users/<id>
    Retrieves a single user from the database by id
    If the user does not exist, sends 404
*/
usersRouter.get('/:id', (request, response, next) => {
    const id = +request.params.id;
    usersService.getUserById(id).then(user => {
        if (!user) {
            response.sendStatus(404);
        } else {
            response.json(user);
        }
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
        next();
    })
});

/*
    POST http://localhost:3000/users
    Creates a new user and saves them to the database.
    Returns the inserted data as JSON with status 201.
*/
usersRouter.post('', (request, response, next) => {

    const user = request.body;
    usersService.saveUser(user)
        .then(newUser => {
            response.status(201);
            response.json(newUser);
            next();
        }).catch(err => {
            console.log(err);
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
usersRouter.patch('', (request, response, next) => {
    const user = request.body;
    usersService.patchUser(user)
        .then(updatedUser => {
            if(updatedUser) {
                response.json(updatedUser);
            } else {
                response.sendStatus(404);
            }
        }).catch(err => {
            console.log(err);
            response.sendStatus(500);
        }).finally(() => {
            next();
        })
});

// PUT
usersRouter.put('', (request, response, next) => {
    const body = request.body;
    if (usersService.idTest(body) == false) {
        console.warn(`no user id supplied. saving ${body.username} as new user`);
        usersService.saveUser(body)
            .then(body => {
                response.status(201);
                response.json(body);
                next();
            });
    } else {
        usersService.putUserAtId(body, body.id)
        .then(updatedUser => {
            if(updatedUser) {
                response.status(200);
                response.json(updatedUser);
                next();
            } else {
                console.warn(`no user with id:${body.id}, saving ${body.username} as new user`);
                usersService.saveUser(body)
                .then(body => {
                    response.status(201);
                    response.json(body);
                    next();
            });
        }}).catch(err => {
            console.log(err);
            response.sendStatus(500);
            next();
        });
    }
});
//     usersService.putUserAtId(body, id)
//         .then(updatedUser => {
//             if(updatedUser) {
//                 response.json(updatedUser);

//             } else {
//                 console.log(`user not found with id:${id}, saving as new user.`);
//                 usersService.saveUser(body)
//                 .then(body => {
//                     response.status(201);
//                     console.log('sanity check 99');
//                     response.json(body);
//                     console.log('sanity check 100');
//                     next();
//                 });
//             };
//         }).catch(err => {
//             console.log(err);
//             response.sendStatus(500);
//             next();
//         });
// });



usersRouter.put('/:id', (request, response, next) => {
    const body = request.body;
    const id = +request.params.id;
    if (usersService.idTest(body)) {
        console.warn('user Id must only be in URL for this operation.')
        response.sendStatus(400);
        throw new Error('400');
    }
    usersService.putUserAtId(body, id)
        .then(updatedUser => {
            if(updatedUser) {
                response.status(200);
                response.json(updatedUser);

            } else {
                console.log(`user not found with id:${id}, saving as new user.`);
                usersService.saveUser(body)
                .then(body => {
                    response.status(201);
                    response.json(body);
                    next();
                });
            };
        }).catch(err => {
            console.log(err);
            response.sendStatus(500);
            next();
        });
});

usersRouter.delete('/:id', (request, response, next) => {
    const id = +request.params.id;
    usersService.getUserById(id).then(user => {
        if (!user) {
            response.sendStatus(404);
            next();
        } else {
            usersService.deleteUser(id);
            response.sendStatus(200);
            next();
        }
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
        next();
    })
});
// /* API Methods */

// //feedback check
// // console.log('API Methods');

// usersRouter.get('/:email', (request, response, next) => {
//     const email: string = request.params.email;
//     usersService.getUserByEmail(email).then(user => {
//         console.log('Request received - processing at app.get');
//         response.json(user);
//         next();
//     })
// })

// usersRouter.post('',(request, response, next) => {
//     const user = request.body;
//     usersService.patchUser(user)
//         .then(updatedUser => {
//             if (updatedUser) {
//                 response.json(updatedPerson);
//             } else {
//                 response.sendStatus(404);
//         }
//     }).catch(err => {
//         console.log(err);
//         response.sendStatus(500);
//     }).finally(() => {
//         next();
//     })

//     console.log('Request received - processing at app.post');
//     response.send('processed by app.post');
//     next();
// })

// // app.get('/collections', (request, response, next) => {
// //     console.log('Request received - processing at app.get');
// //     response.json(collections);
// //     next();
// // })

// // app.get('/items', (request, response, next) => {
// //     console.log('Request received - processing at app.get');
// //     response.json(items);
// //     next();
// // })



//May 14th Async functions
/**
 *  /users/{id}/collections - 
 * Array of collections owned by that user or 404 if the user does not exist
 */

// usersRouter.get('/:id/collections', (request, response, next) => {
//     const id: number = parseInt(request.params.id);
//     usersService.getCollectionsByUserId(id);
// });