const request = require('supertest');
const app = require('../index.js'); 

let token;

beforeAll(async () => {
    // Autenticar y obtener un token de autenticación
    const res = await request(app)
        .post('/login')
        .send({ usuario: 'admin', clave: '123' }); 
    token = res.body.accessToken; 
});

describe('Pruebas de API', () => {
    describe('API de Juegos', () => {
        it('debería obtener todos los juegos', async () => {
            const res = await request(app)
                .get('/api/juegos')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.Items).toBeInstanceOf(Array);
        });

        it('debería obtener un juego por ID', async () => {
            const res = await request(app)
                .get('/api/juegos/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('IdJuego');
        });

        it('debería crear un nuevo juego', async () => {
            const res = await request(app)
                .post('/api/juegos')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Nuevo Juego', FechaLanzamiento: '2023-01-01', Precio: 50, Activo: true, IdDesarrollador: 1, IdGeneros: [1], IdPlataformas: [1] });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('IdJuego');
        });

        it('debería actualizar un juego', async () => {
            const res = await request(app)
                .put('/api/juegos/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Juego Actualizado', FechaLanzamiento: '2023-01-01', Precio: 60, Activo: true, IdDesarrollador: 1, IdGeneros: [1], IdPlataformas: [1] });
            expect(res.statusCode).toEqual(204);
        });

        it('debería eliminar un juego', async () => {
            const res = await request(app)
                .delete('/api/juegos/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('API de Géneros', () => {
        it('debería obtener todos los géneros', async () => {
            const res = await request(app)
                .get('/api/generos')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.Items).toBeInstanceOf(Array);
        });

        it('debería obtener un género por ID', async () => {
            const res = await request(app)
                .get('/api/generos/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('IdGenero');
        });

        it('debería crear un nuevo género', async () => {
            const res = await request(app)
                .post('/api/generos')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Nuevo Género', FechaCreacion: '2023-01-01', Activo: true });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('IdGenero');
        });

        it('debería actualizar un género', async () => {
            const res = await request(app)
                .put('/api/generos/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Género Actualizado', FechaCreacion: '2023-01-01', Activo: true });
            expect(res.statusCode).toEqual(204);
        });

        it('debería eliminar un género', async () => {
            const res = await request(app)
                .delete('/api/generos/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('API de Desarrolladores', () => {
        it('debería obtener todos los desarrolladores', async () => {
            const res = await request(app)
                .get('/api/desarrolladores')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.Items).toBeInstanceOf(Array);
        });

        it('debería obtener un desarrollador por ID', async () => {
            const res = await request(app)
                .get('/api/desarrolladores/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('IdDesarrollador');
        });

        it('debería crear un nuevo desarrollador', async () => {
            const res = await request(app)
                .post('/api/desarrolladores')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Nuevo Desarrollador', Pais: 'Argentina', FechaCreacion: '2023-01-01', Activo: true });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('IdDesarrollador');
        });

        it('debería actualizar un desarrollador', async () => {
            const res = await request(app)
                .put('/api/desarrolladores/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Desarrollador Actualizado', Pais: 'Argentina', FechaCreacion: '2023-01-01', Activo: true });
            expect(res.statusCode).toEqual(204);
        });

        it('debería eliminar un desarrollador', async () => {
            const res = await request(app)
                .delete('/api/desarrolladores/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('API de Plataformas', () => {
        it('debería obtener todas las plataformas', async () => {
            const res = await request(app)
                .get('/api/plataformas')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.Items).toBeInstanceOf(Array);
        });

        it('debería obtener una plataforma por ID', async () => {
            const res = await request(app)
                .get('/api/plataformas/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('IdPlataforma');
        });

        it('debería crear una nueva plataforma', async () => {
            const res = await request(app)
                .post('/api/plataformas')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Nueva Plataforma', FechaLanzamiento: '2023-01-01', Activo: true });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('IdPlataforma');
        });

        it('debería actualizar una plataforma', async () => {
            const res = await request(app)
                .put('/api/plataformas/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ Nombre: 'Plataforma Actualizada', FechaLanzamiento: '2023-01-01', Activo: true });
            expect(res.statusCode).toEqual(204);
        });

        it('debería eliminar una plataforma', async () => {
            const res = await request(app)
                .delete('/api/plataformas/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
    });
});