const request = require('supertest');
const app = require('../app');


describe('Cryptocurrencies Routes', () => {
    it('should get user\'s favorite cryptocurrencies', async () => {
        const response = await request(app)
            .get('/cryptocurrencies/favorites')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTdiOTUwZGQ0YTU0MzBlMGI3Njg1NzMiLCJpYXQiOjE3MDI1OTc5MDIsImV4cCI6MTcwNTE4OTkwMn0.lj9z9c0Fo4iYKvufogp00zpdDvhKovbKuyh9OSlwgP0');

        expect(response.status).toBe(200);
    });

    it('should add a cryptocurrency to user\'s favorites', async () => {
        const response = await request(app)
            .post('/cryptocurrencies/favorites')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTdiOTUwZGQ0YTU0MzBlMGI3Njg1NzMiLCJpYXQiOjE3MDI1OTc5MDIsImV4cCI6MTcwNTE4OTkwMn0.lj9z9c0Fo4iYKvufogp00zpdDvhKovbKuyh9OSlwgP0')
            .send({
                name: 'Bitcoin',
                symbol: 'BTC',
            });

        expect(response.status).toBe(201);
    });

    it('should remove a cryptocurrency from user\'s favorites', async () => {
        const addResponse = await request(app)
            .post('/cryptocurrencies/favorites')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTdiOTUwZGQ0YTU0MzBlMGI3Njg1NzMiLCJpYXQiOjE3MDI1OTc5MDIsImV4cCI6MTcwNTE4OTkwMn0.lj9z9c0Fo4iYKvufogp00zpdDvhKovbKuyh9OSlwgP0')
            .send({
                name: 'Bitcoin',
                symbol: 'BTC',
                price: 50000
            });

        const cryptocurrencyId = addResponse.body.capturedID;

        const deleteResponse = await request(app)
            .delete(`/cryptocurrencies/favorites/${cryptocurrencyId}`)
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTdiOTUwZGQ0YTU0MzBlMGI3Njg1NzMiLCJpYXQiOjE3MDI1OTc5MDIsImV4cCI6MTcwNTE4OTkwMn0.lj9z9c0Fo4iYKvufogp00zpdDvhKovbKuyh9OSlwgP0');

        expect(deleteResponse.status).toBe(200);
    });
});