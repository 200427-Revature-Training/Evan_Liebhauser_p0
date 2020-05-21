import express from 'express';
import bodyParser from 'body-parser';
import { collectionsRouter } from '../../src/routers/collections-router';
import * as collectionsService from '../../src/services/collections-service';
import request from 'supertest';

jest.mock('../../src/services/collections-service');
const mockCollectionsService = collectionsService as any;

// Setup Express server and middleware
const app = express();
app.use(bodyParser.json())
app.use('/collections', collectionsRouter);

describe('getAllCollections', () => {
    test('Returns normally under normal circumstances', async () => {
        mockCollectionsService.getAllCollections.mockImplementation(async () => []);
        await request(app)
        // if we send a request to GET "/"
        .get('/collections')
        // We expect to get a response with a status of 200
        .expect(200)
        // and of content-type JSON
        .expect('content-type', 'application/json; charset=utf-8');
    });

})

describe('getCollectionsByUserId', () => {
    test('Returns 500 if error thrown by service', async () => {
        mockCollectionsService.getAllCollections.mockImplementation(async () => {throw new Error()});
        await request(app)
        // if we send a request to GET "/"
        .get('/collections')
        // We expect to get a response with a status of 500
        .expect(500);
    });

})

app.use(bodyParser.json())

app.unsubscribe('/collections', collectionsRouter);


//test GET /collections/:id
// write test that asserts that normal behavior should return a JSON payload with status 200
// write test that asserts if no object is returned (i.e. service returns falsy) status 404
// write test that asserts if service throws error, status 500

describe('Get collections by Id', () => {
    test('Normal behavior returns JSON with status 200', async () => {
        mockCollectionsService.getCollectionById.mockImplementation(async () => []);
        await request(app)
        .get('/collections/1')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('Get collections by Id', () => {
    test('if no object is returned, return status 404', async () => {
        mockCollectionsService.getCollectionById.mockImplementation(async () => (0));
        await request(app)
        .get('/collections/1')
        .expect(404)
    });
});

describe('Get collections by Id', () => {
    test('if service throws error, return status 500', async () => {
        mockCollectionsService.getCollectionById.mockImplementation(async () => {throw new Error()});
        await request(app)
        .get('/collections/1')
        .expect(500)
    });
})


//GET collections by owner Id
describe('Get collections by user Id', () => {
    test('Normal behavior returns JSON with status 200', async () => {
        mockCollectionsService.getCollectionsByUserId.mockImplementation(async () => []);
        await request(app)
        .get('/collections/owners/1')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('cant find collections by user Id', () => {
    test('if there is no user by the specified id, should return 404', async () => {
        mockCollectionsService.getCollectionsByUserId.mockImplementation(async () => [undefined]);
        await request(app)
        .get('/collections/owners/1')
        .expect(404)
    });
})

describe('get collections by user Id', () => {
    test('if service throws error, should return status 500', async () => {
        mockCollectionsService.getCollectionsByUserId.mockImplementation(async () => {throw new Error()});
        await request(app)
        .get('/collections/owners/1')
        .expect(500)
    });
})

//POST collection
describe('save new collection', () => {
    test('standard function should save collection and return 201/json', async () => {
        mockCollectionsService.saveCollection.mockImplementation(async () => []);
        await request(app)
        .post('/collections')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('save new collection', () => {
    test('if service throws error, should return status 500', async () => {
        mockCollectionsService.saveCollection.mockImplementation(async () => {throw new Error()});
        await request(app)
        .post('/collections')
        .expect(500)
    })
})

//PATCH collection
describe('patch existing collection', () => {
    test('in normal operation, should update specified collection, then return 200/json ', async () => {
        mockCollectionsService.patchCollection.mockImplementation(async () => []);
        await request(app)
        .patch('/collections')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('patch nonexistent collection', () => {
    test('if the service cannot find an collection to patch, it should return 404', async () => {
        mockCollectionsService.patchCollection.mockImplementation(async () => false);
        await request(app)
        .patch('/collections')
        .expect(404)
    });
})

describe('patch collection error', () => {
    test('if the service throws an error, should return status 500', async () => {
        mockCollectionsService.patchCollection.mockImplementation(async () => {throw new Error()});
        await request(app)
        .patch('/collections')
        .expect(500)
    });
})

//Put Collection
describe('put new collection', () => {
    test('if supplied collection does not exist, creates it and returns 201/json ', async () => {
        mockCollectionsService.putCollection.mockImplementation(async () => []);
        mockCollectionsService.saveCollection.mockImplementation(async () => []);
        await request(app)
        .put('/collections')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('put existing collection', () => {
    test('if supplied collection already exists, updates it and returns 200/json', async () => {
        mockCollectionsService.putCollection.mockImplementation(async () => []);
        await request(app)
        .put('/collections')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('put collection error', () => {
    test('if service throws error, should return status 500', async () => {
        mockCollectionsService.putCollection.mockImplementation(async () => {throw new Error()});
        await request(app)
        .put('/collections')
        .expect(500)
    });
})

// DELETE Collection
describe('delete collection', () => {
    test('if specified collection is found, it is deleted and 200 is returned', async () => {
        mockCollectionsService.getCollectionById.mockImplementation(async () => []);
        mockCollectionsService.deleteCollection.mockImplementation(async () => []);
        await request(app)
        .delete('/collections/1')
        .expect(200)
    });
})

describe('delete collection', () => {
    test('if specified collection cannot be found, 404 is returned', async () => {
        mockCollectionsService.getCollectionById.mockImplementation(async () => false);
        await request(app)
        .delete('/collections/999999')
        .expect(404)
    });
})

describe('delete collection', () => {
    test('if service throws error, should return status 500', async () => {
        mockCollectionsService.getCollectionById.mockImplementation(async () => {throw new Error()});
        await request(app)
        .delete('/collections/1')
        .expect(500)
    });
})