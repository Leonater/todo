import request from 'supertest';
import { app, server, db } from './index';
import getKeycloakToken from './utils';

let token; // Speichert den abgerufenen JWT-Token

beforeAll(async () => {
    token = await getKeycloakToken();
});

describe('GET /todos (unautorisiert)', () => {
    it('sollte einen 401-Fehler zurückgeben, wenn kein Token bereitgestellt wird', async () => {
        const response = await request(app).get('/todos'); // Kein Authorization-Header

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
    });
});

describe('GET /todos', () => {
    it('sollte eine leere Liste zurückgeben, wenn keine Todos vorhanden sind', async () => {
        const response = await request(app)
            .get('/todos')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('sollte alle Todos abrufen', async () => {
        const newTodo = {
            "title": "Todo 1",
            "due": "2023-12-01T00:00:00.000Z",
            "status": 0
        };

        await db.insert(newTodo); // Füge ein Todo direkt zur DB hinzu
        const response = await request(app)
            .get('/todos')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe('POST /todos', () => {
    it('sollte ein neues Todo erstellen', async () => {
        const newTodo = {
            "title": "Todo 2",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.due).toBe(newTodo.due);
    });

    it('sollte einen 400-Fehler zurückgeben, wenn das Todo unvollständig ist', async () => {
        const newTodo = {
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0,
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        expect(response.statusCode).toBe(400);
    });

    it('sollte einen 400-Fehler zurückgeben, wenn das Datum ungültig ist', async () => {
        const invalidTodo = {
            "title": "Ungültiges Datum",
            "due": "ungültiges-datum",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidTodo);

        expect(response.statusCode).toBe(400);
    });
}); 0

describe('GET /todos/:id', () => {
    it('sollte ein Todo abrufen', async () => {
        const newTodo = {
            "title": "Todo 3",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        const id = response.body._id;

        const getResponse = await request(app)
            .get(`/todos/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.title).toBe(newTodo.title);
        expect(getResponse.body.due).toBe(newTodo.due);
    });

    it('sollte einen 404-Fehler zurückgeben, wenn das Todo nicht gefunden wurde', async () => {
        const id = '123456789012345678901234';

        const getResponse = await request(app)
            .get(`/todos/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getResponse.statusCode).toBe(404);
    });
});

describe('PUT /todos/:id', () => {
    it('sollte ein Todo aktualisieren', async () => {
        const newTodo = {
            "title": "Todo 4",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        const updatedTodo = {
            "title": "Todo 4",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 1,
            "_id": response.body._id
        };

        const updateResponse = await request(app)
            .put(`/todos/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedTodo);

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.status).toBe(updatedTodo.status);
    });

    it('sollte einen 404-Fehler zurückgeben, wenn das Todo nicht existiert', async () => {
        const nonExistentId = '6452c3f8c7b4e842d90123aa';
        const response = await request(app)
            .put(`/todos/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                "_id": nonExistentId,
                "title": "Nicht existent",
                "due": "2023-12-01T00:00:00.000Z",
                "status": 0
            });

        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE /todos/:id', () => {
    it('sollte ein Todo löschen', async () => {
        const newTodo = {
            "title": "Todo 5",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        const deleteResponse = await request(app)
            .delete(`/todos/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`);


        expect(deleteResponse.statusCode).toBe(204);

        const getResponse = await request(app)
            .get(`/todos/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getResponse.statusCode).toBe(404);
    });

    it('sollte einen 404-Fehler zurückgeben, wenn das Todo nicht existiert', async () => {
        const nonExistentId = '6452c3f8c7b4e842d90123aa'; // Gültiges, aber nicht existierendes MongoDB-ObjectId

        const response = await request(app)
            .delete(`/todos/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
    });
});


afterAll(async () => {
    server.close()
    db.close()
})
