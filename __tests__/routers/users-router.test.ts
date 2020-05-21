import express from 'express';
import bodyParser from 'body-parser';
import { usersRouter } from '../../src/routers/users-router';
import * as usersService from '../../src/services/users-service';
import request from 'supertest';
import { User } from '../../src/models/User';

jest.mock('../../src/services/users-service');
const mockUsersService = usersService as any;

// Setup Express server and middleware
const app = express();
app.use(bodyParser.json())
app.use('/users', usersRouter);

describe('getAllUsers', () => {
    test('Returns normally under normal circumstances', async () => {
        mockUsersService.getAllUsers.mockImplementation(async () => []);
        await request(app)
        // if we send a request to GET "/"
        .get('/users')
        // We expect to get a response with a status of 200
        .expect(200)
        // and of content-type JSON
        .expect('content-type', 'application/json; charset=utf-8');
    });

})

// describe('getUserByItemId', () => {
//     test('Returns normally under normal circumstances', async () => {
//         mockUsersService.getAllUsers.mockImplementation(async () => []);
//         await request(app)
//         // if we send a request to GET "/"
//         .get('/users')
//         // We expect to get a response with a status of 200
//         .expect(200)
//         // and of content-type JSON
//         .expect('content-type', 'application/json; charset=utf-8');
//     });

// })

app.use(bodyParser.json())

app.unsubscribe('/users', usersRouter);


//test GET /users/:id
// write test that asserts that normal behavior should return a JSON payload with status 200
// write test that asserts if no object is returned (i.e. service returns falsy) status 404
// write test that asserts if service throws error, status 500

describe('Get user by Id', () => {
    test('Normal behavior returns JSON with status 200', async () => {
        mockUsersService.getUserById.mockImplementation(async () => []);
        await request(app)
        .get('/users/1')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('Get user by Id', () => {
    test('if no object is returned, return status 404', async () => {
        mockUsersService.getUserById.mockImplementation(async () => (0));
        await request(app)
        .get('/users/1')
        .expect(404)
    });
});

describe('Get user by Id', () => {
    test('if service throws error, return status 500', async () => {
        mockUsersService.getUserById.mockImplementation(async () => {throw new Error()});
        await request(app)
        .get('/users/1')
        .expect(500)
    });
})

//test POST user
describe('POST new user', () => {
    test('normal behavior returns 201 and newUser json', async () => {
        mockUsersService.saveUser.mockImplementation(async () => []);
        await request(app)
        .post('/users')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('POST new user', () => {
    test('returns status 500 if service throws error', async () => {
        mockUsersService.saveUser.mockImplementation(async () => {throw new Error()});
        await request(app)
        .post('/users')
        .expect(500)
    });
})

//test PATCH user
describe('patch new user', () => {
    test('normal behavior returns 201 and newUser json', async () => {
        mockUsersService.patchUser.mockImplementation(async () => []);
        await request(app)
        .patch('/users')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('patch new user', () => {
    test('returns status 404 if no user to patch (usersService passes nothing back)', async () => {
        mockUsersService.patchUser.mockImplementation(async () => false);
        await request(app)
        .patch('/users')
        .expect(404)
    });
})

describe('patch new user', () => {
    test('returns status 500 if service throws error', async () => {
        mockUsersService.patchUser.mockImplementation(async () => {throw new Error()});
        await request(app)
        .patch('/users')
        .expect(500)
    });
})

//test PUT user
describe('put user w/o id', () => {
    test('if no id provided, but username/email is, create new user and return 201/json', async () => {
        mockUsersService.idTest.mockImplementation(async () => false);
        mockUsersService.saveUser.mockImplementation(async () => []);
        await request(app)
        .put('/users')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
        /* this one works in postman, i think i've got the test wrong somehow */
    });
})

describe('put existing user', () => {
    test('if id of existing user provided and username/email provided, update specified user and return 200/json', async () => {
        mockUsersService.idTest.mockImplementation(async () => true);
        mockUsersService.putUserAtId.mockImplementation(async () => []);
        await request(app)
        .put('/users')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('put new user', () => {
    test('creates new user and returns status 201/json if id provided does not match any existing user', async () => {
        mockUsersService.idTest.mockImplementation(async () => true);
        mockUsersService.putUserAtId.mockImplementation(async () => false);
        mockUsersService.saveUser.mockImplementation(async () => []);
        await request(app)
        .put('/users')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('put new user', () => {
    test('returns status 500 if service throws error', async () => {
        mockUsersService.putUserAtId.mockImplementation(async () => {throw new Error()});
        await request(app)
        .put('/users')
        .expect(500)
    });
})


//test PUT /:id
describe('put user at id w/id in body', () => {
    test('if user has an id in the url and body, program returns 400', async () => {
        mockUsersService.idTest.mockImplementation(async () => true);
        await request(app)
        .put('/users/4')
        .expect(400)
    });
})

describe('put existing user at id', () => {
    test('if id of existing user provided and username/email provided, update specified user and return 200/json', async () => {
        const id = 4;
        mockUsersService.idTest.mockImplementation(async () => false);
        mockUsersService.putUserAtId.mockImplementation(async () => []);
        await request(app)
        .put('/users/4')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
        /* this one works in postman, i think i've got the test wrong somehow */
    });
})

describe('put new user at id', () => {
    test('creates new user and returns status 201/json if id provided does not match any existing user', async () => {
        const id = 4;
        mockUsersService.idTest.mockImplementation(async () =>false);
        mockUsersService.putUserAtId.mockImplementation(async () => false);
        mockUsersService.saveUser.mockImplementation(async () => []);
        await request(app)
        .put('/users/4')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
        /* this one works in postman, i think i've got the test wrong somehow */
    });
})

describe('put user at id error', () => {
    test('returns status 500 if service throws error', async () => {
        mockUsersService.putUserAtId.mockImplementation(async () => {throw new Error()});
        await request(app)
        .put('/users')
        .expect(500)
    });
})

//DELETE user
describe(' delete user by id', () => {
    test('attempting to delete nonexistent user results in 404', async () => {
        mockUsersService.getUserById.mockImplementation(async () => []);
        await request(app)
        .delete('/users/9999999')
        .expect(404)
    });
})

describe(' delete user by id', () => {
    test('if user is found, user is deleted and a 200 response is sent', async () => {
        mockUsersService.getUserById.mockImplementation(async () => []);
        await request(app)
        .delete('/users/9999999')
        .expect(200)
    });
})

describe(' delete user by id', () => {
    test('should return 500 if service throws error', async () => {
        mockUsersService.getUserById.mockImplementation(async () => {throw new Error()});
        await request(app)
        .delete('/users/9999999')
        .expect(500)
    });
})