import * as usersService from '../../src/services/users-service';
import * as usersDao from '../../src/daos/users-dao';
import { User } from '../../src/models/User';

/*
    Black-box testing vs White-box testing

    Black-box testing tests ONLY input-output of the function.
    White-box testing tests the known internal behavior of the function.
*/

/*
    Mocks the imported module
    The mocked module will allow us to
    stub methods - essentially replacing the
    original behavior with explicitly provided
    behavior such that our tests will not
    test the original behavior of this dependency
*/
jest.mock('../../src/daos/users-dao');

const mockUsersDao = usersDao as any;

describe('getAllUsers', () => {
    test('when function working normally, it should uneventfully pass data to Dao', async () => {
        expect.assertions(0);
        mockUsersDao.getAllUsers.mockImplementation(() => {
        })

    })
})

describe('getUserById', () => {
    test('when function working normally, it should uneventfully pass data to Dao', async () => {
        expect.assertions(0);
        mockUsersDao.getUserById.mockImplementation(() => {
        })

    })
})

describe('saveUser', () => {
    test('422 returned if no username provided', async () => {
        // usersDao.saveUser will return undefined rather than execute
        expect.assertions(1);
        // Stubbing - Replacing a method with a fake method implementation
        mockUsersDao.saveUser.mockImplementation(() => {
            console.log('This is what mock dao actually calls');
        });

        const payload = {
            email: 'test@test.email'
        }

        try {
            // This async function should reject due to missing username
            await usersService.saveUser(payload);
            fail('usersService.saveUser did not throw expected error');
        } catch(err) {
            // assign error object to expectedError
            expect(err).toBeDefined();
        }
        // Validate that error was thrown
    });

    test('422 returned if no email is provided', async () => {
        // usersDao.saveUser will return undefined rather than execute
        expect.assertions(1);
        // Stubbing - Replacing a method with a fake method implementation
        mockUsersDao.saveUser.mockImplementation(() => {
            console.log('This is what mock dao actually calls');
        });

        const payload = {
            username: 'testuser',
        }

        try {
            // This async function should reject due to missing username
            await usersService.saveUser(payload);
            fail('usersService.saveUser did not throw expected error');
        } catch(err) {
            // assign error object to expectedError
            expect(err).toBeDefined();
        }
        // Validate that error was thrown

        test('422 returned if no relevant data is provided', async () => {
            // usersDao.saveUser will return undefined rather than execute
            expect.assertions(1);
            // Stubbing - Replacing a method with a fake method implementation
            mockUsersDao.saveUser.mockImplementation(() => {
                console.log('This is what mock dao actually calls');
            });
    
            const payload = {
                id: 5,
            }
    
            try {
                // This async function should reject due to missing username
                await usersService.saveUser(payload);
                fail('usersService.saveUser did not throw expected error');
            } catch(err) {
                // assign error object to expectedError
                expect(err).toBeDefined();
            }
            // Validate that error was thrown
    });
})

    test('Input object transformed to User object', async () => {
        mockUsersDao.saveUser.mockImplementation(o => o);

        const payload = {
            username: 'testuser',
            email: 'test@test.email',
        };

        const result = await usersService.saveUser(payload);

        expect(payload).not.toBeInstanceOf(User);
        expect(result).toBeInstanceOf(User);
    });

    test('ID value of input is replaced in output', async () => {
        mockUsersDao.saveUser.mockImplementation(o => o);

        const payload = {
            id: 15,
            username: 'testuser',
            email: 'test@test.email',
        };

        const result = await usersService.saveUser(payload);

        expect(result.id).not.toBe(payload.id);
    });

    test('Extraneous fields in input are not in output', async () => {
        mockUsersDao.saveUser.mockImplementation(o => o);

        const payload = {
            username: 'testuser',
            email: 'test@test.email',

            likesSkateboards: true
        };

        const result = await usersService.saveUser(payload) as any;

        expect(result.likesSkateboards).not.toBeDefined();
    });
});


describe('patchUser', () => {
    /* Testing behavior of patchUser */
    /*
        1. When a valid patch with an id property is provied, patch succeeds
            returning a truthy object.
        2. When a patch with no id property is provided, an error should be thrown.
    */

    test('successful patch', async () => {
        expect.assertions(1);

        mockUsersDao.patchUser
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            username: 'testuser',
            email: 'test@test.email',
        };

        const result = await usersService.patchUser(payload);
        expect(result).toBeTruthy();
    });

    test('patch fails when no valid id is provided', async () => {
        expect.assertions(1);

        mockUsersDao.patchUser
            .mockImplementation(() => ({}));

        const payload = {
            username: 'testuser',
            email: 'test@test.email',
        };

        try {
            await usersService.patchUser(payload);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
});

//putUser
describe('putUser', () => {
    /* Testing behavior of putUser */
    /*
        1. When a valid put with an id property is provied, put succeeds
            returning a truthy object.
        2. When a put with no id property is provided, an error should be thrown.
    */

    test('successful put', async () => {
        expect.assertions(1);

        mockUsersDao.putUser
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            username: 'testuser',
            email: 'test@test.email',
        };

        const result = await usersService.putUser(payload);
        expect(result).toBeTruthy();
    });

    test('put fails when no valid id is provided', async () => {
        expect.assertions(1);

        mockUsersDao.putUser
            .mockImplementation(() => ({}));

        const payload = {
            username: 'testuser',
            email: 'test@test.email',
        };

        try {
            await usersService.putUser(payload);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
});

//PUT user at id
describe('putUser', () => {
    /* Testing behavior of putUser */
    /*
        1. When a valid put with an id property is provied, put succeeds
            returning a truthy object.
        2. When a put with no id property is provided, an error should be thrown.
    */

    test('successful put', async () => {
        expect.assertions(1);

        mockUsersDao.putUserAtId
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            username: 'testuser',
            email: 'test@test.email',
        };

        const result = await usersService.putUserAtId(payload, payload.id);
        expect(result).toBeTruthy();
    });

    test('put fails when no valid id is provided', async () => {
        expect.assertions(1);

        mockUsersDao.putUserAtId
            .mockImplementation(() => ({}));

        const payload = {
            username: 'testuser',
            email: 'test@test.email',
        };

        try {
            await usersService.putUserAtId(payload, undefined);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });

    test('put fails when no valid username is provided', async () => {
        expect.assertions(1);

        mockUsersDao.putUserAtId
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            email: 'test@test.email',
        };

        try {
            await usersService.putUserAtId(payload, payload.id);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
    test('put fails when no valid email is provided', async () => {
        expect.assertions(1);

        mockUsersDao.putUserAtId
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            username: 'testuser',
        };

        try {
            await usersService.putUserAtId(payload, payload.id);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
});