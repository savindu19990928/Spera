const request = require('supertest');
const express = require('express');
const authRouter = require('../src/routes/auth');
const User = require('../src/models/user');

// Mock the User model
jest.mock('../src/models/user');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('User Registration', () => {
    it('should register a new user successfully', async () => {
        const registerResponse = await request(app)
            .post('/auth/register')
            .send({
                username: 'newUser',
                email: 'newuser@example.com',
                password: 'password123',
            });

        expect(registerResponse.status).toBe(201);
        expect(registerResponse.body.token).toBeDefined();
    });

    it('should return an error if the username is already taken', async () => {
        // Mock existing user
        User.findOne.mockResolvedValueOnce({ username: 'existingUser' });

        const registerResponse = await request(app)
            .post('/auth/register')
            .send({
                username: 'existingUser',
                email: 'existinguser@example.com',
                password: 'password123',
            });

        expect(registerResponse.status).toBe(400);
        expect(registerResponse.body.message).toBe('Username is already taken');
    });
});

describe('User Login', () => {
    it('should log in an existing user successfully', async () => {
        // Mock the existing user and validatePassword function
        User.findOne.mockResolvedValueOnce({
            username: 'existingUser',
            validatePassword: jest.fn().mockResolvedValue(true),
            _id: 'someUserId',
        });

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                username: 'existingUser',
                password: 'correctPassword',
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.token).toBeDefined();
    });

    it('should return an error for invalid username or password', async () => {
        // Mock the user not found or invalid password
        User.findOne.mockResolvedValueOnce(null);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                username: 'nonexistentUser',
                password: 'wrongPassword',
            });

        expect(loginResponse.status).toBe(401);
        expect(loginResponse.body.message).toBe('Invalid username or password');
    });
});