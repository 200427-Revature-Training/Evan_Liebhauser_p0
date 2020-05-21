import * as itemsService from '../../src/services/items-service';
import * as itemsDao from '../../src/daos/items-dao';
import { Item } from '../../src/models/Item';

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
jest.mock('../../src/daos/items-dao');

const mockItemsDao = itemsDao as any;

describe('saveItem', () => {
    test('422 returned if no itemname provided', async () => {
        // itemsDao.saveItem will return undefined rather than execute
        expect.assertions(1);
        // Stubbing - Replacing a method with a fake method implementation
        mockItemsDao.saveItem.mockImplementation(() => {
            console.log('This is what mock dao actually calls');
        });

        const payload = {
            worth: 100
        }

        try {
            // This async function should reject due to missing itemname
            await itemsService.saveItem(payload);
            fail('itemsService.saveItem did not throw expected error');
        } catch(err) {
            // assign error object to expectedError
            expect(err).toBeDefined();
        }
        // Validate that error was thrown
    });

    test('Input object transformed to Item object', async () => {
        mockItemsDao.saveItem.mockImplementation(o => o);

        const payload = {
            itemname: 'testitem',
            worth: 100,
        };

        const result = await itemsService.saveItem(payload);

        expect(payload).not.toBeInstanceOf(Item);
        expect(result).toBeInstanceOf(Item);
    });

    test('ID value of input is replaced in output', async () => {
        mockItemsDao.saveItem.mockImplementation(o => o);

        const payload = {
            id: 15,
            itemname: 'testitem',
            worth: 100,
        };

        const result = await itemsService.saveItem(payload);

        expect(result.id).not.toBe(payload.id);
    });

    test('Extraneous fields in input are not in output', async () => {
        mockItemsDao.saveItem.mockImplementation(o => o);

        const payload = {
            itemname: 'testitem',
            worth: 100,
            likesSkateboards: true
        };

        const result = await itemsService.saveItem(payload) as any;

        expect(result.likesSkateboards).not.toBeDefined();
    });
});


describe('patchItem', () => {
    /* Testing behavior of patchItem */
    /*
        1. When a valid patch with an id property is provied, patch succeeds
            returning a truthy object.
        2. When a patch with no id property is provided, an error should be thrown.
    */

    test('successful patch', async () => {
        expect.assertions(1);

        mockItemsDao.patchItem
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            itemname: 'testitem',
            worth: 100,
        };

        const result = await itemsService.patchItem(payload);
        expect(result).toBeTruthy();
    });

    test('patch fails when no valid id is provided', async () => {
        expect.assertions(1);

        mockItemsDao.patchItem
            .mockImplementation(() => ({}));

        const payload = {
            itemname: 'testitem',
            worth: 100,
        };

        try {
            await itemsService.patchItem(payload);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
});

describe('putItem', () => {
    /* Testing behavior of putItem */
    /*
        1. When a valid put with an id property is provied, put succeeds
            returning a truthy object.
        2. When a put with no id property is provided, an error should be thrown.
    */

    test('successful put', async () => {
        expect.assertions(1);

        mockItemsDao.putItem
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            itemname: 'testitem',
            worth: 100,
        };

        const result = await itemsService.putItem(payload);
        expect(result).toBeTruthy();
    });

    test('put fails when no valid id is provided', async () => {
        expect.assertions(1);

        mockItemsDao.putItem
            .mockImplementation(() => ({}));

        const payload = {
            itemname: 'testitem',
            worth: 100,
        };

        try {
            await itemsService.putItem(payload);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
});