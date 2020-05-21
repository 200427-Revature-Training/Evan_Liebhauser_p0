import express from 'express';
import * as collectionsService from '../services/collections-service';

export const collectionsRouter = express.Router();

/*
    http://localhost:3000/collections
    Retrieves an array of collections from database
*/
collectionsRouter.get('', (request, response, next) => {
    collectionsService.getAllCollections().then(collections => {
        response.json(collections);
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
    });
});

/*
    http://localhost:3000/collections/1
    Retrieves a single collection from the database by id
    If the collection does not exist, sends 404
*/
collectionsRouter.get('/:id', (request, response, next) => {
    const id = +request.params.id;
    collectionsService.getCollectionById(id).then(collection => {
        if (!collection) {
            response.sendStatus(404);
        } else {
            response.json(collection);
        }
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
        next();
    })
});

collectionsRouter.get('/owners/:id', (request, response, next) => {
    const id = +request.params.id;
    collectionsService.getCollectionsByUserId(id).then(collections => {
        if (!collections) {
            response.sendStatus(404);
        } else {
            response.json(collections);
        }
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
        next();
    })
});

/*
    POST http://localhost:3000/collections
    Creates a new collection and saves them to the database.
    Returns the inserted data as JSON with status 201.
*/
collectionsRouter.post('', (request, response, next) => {
    const collection = request.body;
    collectionsService.saveCollection(collection)
        .then(newCollection => {
            response.status(201);
            response.json(newCollection);
            next();
        }).catch(err => {
            console.log(err);
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
collectionsRouter.patch('', (request, response, next) => {
    const collection = request.body;
    collectionsService.patchCollection(collection)
        .then(updatedCollection => {
            if(updatedCollection) {
                response.json(updatedCollection);
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
collectionsRouter.put('', (request, response, next) => {
    const collection = request.body;
    collectionsService.putCollection(collection)
        .then(updatedCollection => {
            if(updatedCollection) {
                response.json(updatedCollection);
            } else {
                collectionsService.saveCollection(collection)
                .then(newCollection => {
                    response.status(201);
                    response.json(newCollection);
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

collectionsRouter.delete('/:id', (request, response, next) => {
    const id = +request.params.id;
    collectionsService.getCollectionById(id).then(collection => {
        if (!collection) {
            response.sendStatus(404);
        } else {
            collectionsService.deleteCollection(id);
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