import * as collectionsService from '../../src/services/collections-service';
import * as collectionsDao from '../../src/daos/collections-dao';
import { Collection } from '../../src/models/Collection';

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
jest.mock('../../src/daos/collections-dao');

const mockCollectionsDao = collectionsDao as any;

describe('saveCollection', () => {
    test('422 returned if no collectionname provided', async () => {
        // collectionsDao.saveCollection will return undefined rather than execute
        expect.assertions(1);
        // Stubbing - Replacing a method with a fake method implementation
        mockCollectionsDao.saveCollection.mockImplementation(() => {
            console.log('This is what mock dao actually calls');
        });

        const payload = {
            collection_type: "example"
        }

        try {
            // This async function should reject due to missing collectionname
            await collectionsService.saveCollection(payload);
            fail('collectionsService.saveCollection did not throw expected error');
        } catch(err) {
            // assign error object to expectedError
            expect(err).toBeDefined();
        }
        // Validate that error was thrown
    });

    test('Input object transformed to Collection object', async () => {
        mockCollectionsDao.saveCollection.mockImplementation(o => o);

        const payload = {
            collectionname: 'testcollection',
            collection_type: "example",
        };

        const result = await collectionsService.saveCollection(payload);

        expect(payload).not.toBeInstanceOf(Collection);
        expect(result).toBeInstanceOf(Collection);
    });

    test('ID value of input is replaced in output', async () => {
        mockCollectionsDao.saveCollection.mockImplementation(o => o);

        const payload = {
            id: 15,
            collectionname: 'testcollection',
            lastName: 'test@test.email',
        };

        const result = await collectionsService.saveCollection(payload);

        expect(result.id).not.toBe(payload.id);
    });

    test('Extraneous fields in input are not in output', async () => {
        mockCollectionsDao.saveCollection.mockImplementation(o => o);

        const payload = {
            collectionname: 'testcollection',
            collection_type: "example",
            likesSkateboards: true
        };

        const result = await collectionsService.saveCollection(payload) as any;

        expect(result.likesSkateboards).not.toBeDefined();
    });
});


describe('patchCollection', () => {
    /* Testing behavior of patchCollection */
    /*
        1. When a valid patch with an id property is provied, patch succeeds
            returning a truthy object.
        2. When a patch with no id property is provided, an error should be thrown.
    */

    test('successful patch', async () => {
        expect.assertions(1);

        mockCollectionsDao.patchCollection
            .mockImplementation(() => ({}));

        const payload = {
            id: 1,
            collectionname: 'testcollection',
            collection_type: "example",
        };

        const result = await collectionsService.patchCollection(payload);
        expect(result).toBeTruthy();
    });

    test('patch fails when no valid id is provided', async () => {
        expect.assertions(1);

        mockCollectionsDao.patchCollection
            .mockImplementation(() => ({}));

        const payload = {
            collectionname: 'testcollection',
            collection_type: "example",
        };

        try {
            await collectionsService.patchCollection(payload);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
});