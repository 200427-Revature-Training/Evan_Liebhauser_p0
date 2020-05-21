import express from 'express';
import * as itemsService from '../services/items-service';

export const itemsRouter = express.Router();

/*
    http://localhost:3000/items
    Retrieves an array of items from database
*/
itemsRouter.get('', (request, response, next) => {
    itemsService.getAllItems().then(items => {
        response.json(items);
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
    });
});

/*
    http://localhost:3000/items/1
    Retrieves a single item from the database by id
    If the item does not exist, sends 404
*/
itemsRouter.get('/:id', (request, response, next) => {
    const id = +request.params.id;
    itemsService.getItemById(id).then(item => {
        if (!item) {
            response.sendStatus(404);
            next();
        } else {
            response.json(item);
        }
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
        next();
    })
});

/* 
    http://localhost:3000/items/username
    Retrieves all items from the database owned by specific user
    If the user does not exist, sends 404
*/
itemsRouter.get('/owners/:id', (request, response, next) => {
    const id = +request.params.id;
    itemsService.getItemsByUserId(id).then(items => {
        if (!items) {
            response.sendStatus(404);
            next();
        } else {
            response.sendStatus(200);
            response.json(items);
            next();
        }
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
        next();
        })
    }
)


/*
    POST http://localhost:3000/items
    Creates a new item and saves them to the database.
    Returns the inserted data as JSON with status 201.
*/
itemsRouter.post('', (request, response, next) => {
    const item = request.body;
    itemsService.saveItem(item)
        .then(newItem => {
            response.status(201);
            response.json(newItem);
            next();
        }).catch(err => {
            console.log(err);
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
itemsRouter.patch('', (request, response, next) => {
    const item = request.body;
    itemsService.patchItem(item)
        .then(updatedItem => {
            if(updatedItem) {
                response.sendStatus(200);
                response.json(updatedItem);
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
itemsRouter.put('', (request, response, next) => {
    const item = request.body;
    itemsService.putItem(item)
        .then(updatedItem => {
            if(updatedItem) {
                response.json(updatedItem);
            } else {
                itemsService.saveItem(item)
                .then(newItem => {
                    response.status(201);
                    response.json(newItem);
                    next();
                })
            }
        }).catch(err => {
            console.log(err);
            response.sendStatus(500);
        }).finally(() => {
            next();        
        })
});

// DELETE
itemsRouter.delete('/:id', (request, response, next) => {
    const id = +request.params.id;
    itemsService.getItemById(id).then(item => {
        if (!item) {
            response.sendStatus(404);
        } else {
            itemsService.deleteItem(id);
            response.sendStatus(200);
            next();
        }
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
    }).finally(() => {
        next();
    })
});