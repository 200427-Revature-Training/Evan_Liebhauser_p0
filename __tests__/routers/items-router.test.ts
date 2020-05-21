import express from 'express';
import bodyParser from 'body-parser';
import { itemsRouter } from '../../src/routers/items-router';
import * as itemsService from '../../src/services/items-service';
import request from 'supertest';

jest.mock('../../src/services/items-service');
const mockItemsService = itemsService as any;

// Setup Express server and middleware
const app = express();
app.use(bodyParser.json())
app.use('/items', itemsRouter);

describe('getAllItems', () => {
    test('Returns normally under normal circumstances', async () => {
        mockItemsService.getAllItems.mockImplementation(async () => []);
        await request(app)
        // if we send a request to GET "/"
        .get('/items')
        // We expect to get a response with a status of 200
        .expect(200)
        // and of content-type JSON
        .expect('content-type', 'application/json; charset=utf-8');
    });

})

describe('getItemsByUserId', () => {
    test('Returns 500 if error thrown by service', async () => {
        mockItemsService.getAllItems.mockImplementation(async () => {throw new Error()});
        await request(app)
        // if we send a request to GET "/"
        .get('/items')
        // We expect to get a response with a status of 500
        .expect(500);
    });

})

app.use(bodyParser.json())

app.unsubscribe('/items', itemsRouter);


//test GET /items/:id
// write test that asserts that normal behavior should return a JSON payload with status 200
// write test that asserts if no object is returned (i.e. service returns falsy) status 404
// write test that asserts if service throws error, status 500

describe('Get items by Id', () => {
    test('Normal behavior returns JSON with status 200', async () => {
        mockItemsService.getItemById.mockImplementation(async () => []);
        await request(app)
        .get('/items/1')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('Get items by Id', () => {
    test('if no object is returned, return status 404', async () => {
        mockItemsService.getItemById.mockImplementation(async () => (0));
        await request(app)
        .get('/items/1')
        .expect(404)
    });
});

describe('Get items by Id', () => {
    test('if service throws error, return status 500', async () => {
        mockItemsService.getItemById.mockImplementation(async () => {throw new Error()});
        await request(app)
        .get('/items/1')
        .expect(500)
    });
})


//GET itemm by owner Id
describe('Get items by user Id', () => {
    test('Normal behavior returns JSON with status 200', async () => {
        mockItemsService.getItemsByUserId.mockImplementation(async () => []);
        await request(app)
        .get('/items/1')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('cant finditems by user Id', () => {
    test('if there is no user by the specified id, should return 404', async () => {
        mockItemsService.getItemsByUserId.mockImplementation(async () => [undefined]);
        await request(app)
        .get('/items/9999')
        .expect(404)
    });
})

describe('get items by user Id', () => {
    test('if service throws error, should return status 500', async () => {
        mockItemsService.getItemsByUserId.mockImplementation(async () => {throw new Error()});
        await request(app)
        .get('/items/1')
        .expect(500)
    });
})

//POST item
describe('save new item', () => {
    test('standard function should save item and return 201/json', async () => {
        mockItemsService.saveItem.mockImplementation(async () => []);
        await request(app)
        .post('/items')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('save new item', () => {
    test('if service throws error, should return status 500', async () => {
        mockItemsService.saveItem.mockImplementation(async () => {throw new Error()});
        await request(app)
        .post('/items')
        .expect(500)
    })
})

//PATCH item
describe('patch existing item', () => {
    test('in normal operation, should update specified item, then return 200/json ', async () => {
        mockItemsService.patchItem.mockImplementation(async () => []);
        await request(app)
        .patch('/items')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('patch nonexistent item', () => {
    test('if the service cannot find an item to patch, it should return 404', async () => {
        mockItemsService.patchItem.mockImplementation(async () => false);
        await request(app)
        .patch('/items')
        .expect(404)
    });
})

describe('patch item error', () => {
    test('if the service throws an error, should return status 500', async () => {
        mockItemsService.patchItem.mockImplementation(async () => {throw new Error()});
        await request(app)
        .patch('/items')
        .expect(500)
    });
})

//Put Item
describe('put new item', () => {
    test('if supplied item does not exist, creates it and returns 200/json ', async () => {
        mockItemsService.putItem.mockImplementation(async () => []);
        mockItemsService.saveItem.mockImplementation(async () => []);
        await request(app)
        .put('/items')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('put existing item', () => {
    test('if supplied item already exists, updates it and returns 201/json', async () => {
        mockItemsService.putItem.mockImplementation(async () => []);
        await request(app)
        .put('/items')
        .expect(201)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})

describe('put item error', () => {
    test('if service throws error, should return status 500', async () => {
        mockItemsService.putItem.mockImplementation(async () => {throw new Error()});
        await request(app)
        .put('/items')
        .expect(500)
    });
})

// DELETE Item
describe('delete item', () => {
    test('if specified item is found, it is deleted and 200 is returned', async () => {
        mockItemsService.putItem.mockImplementation(async () => []);
        await request(app)
        .delete('/items/1')
        .expect(200)
    });
})

describe('delete item', () => {
    test('if specified item cannot be found, 404 is returned', async () => {
        mockItemsService.putItem.mockImplementation(async () => false);
        await request(app)
        .delete('/items/999999')
        .expect(404)
    });
})

describe('delete item', () => {
    test('if service throws error, should return status 500', async () => {
        mockItemsService.putItem.mockImplementation(async () => {throw new Error()});
        await request(app)
        .delete('/items/1')
        .expect(500)
        .expect('content-type', 'application/json; charset=utf-8');
    });
})