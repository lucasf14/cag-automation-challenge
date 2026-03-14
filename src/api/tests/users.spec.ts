import { test, expect } from '@playwright/test';
import { createApiClient } from '../clients/apiClient';
import Ajv from "ajv";
import { userSchema } from "../schemas/user.schema";


// A1. User CRUD Operations
test('GET Users', async ({}) => {
  const api = await createApiClient();
  const pageId = 2;

  const response = await api.get(`/api/users?page=${pageId}`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('data');

  expect(body.data).toBeDefined();
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.page).toBe(2);
});


test('GET User by id (validating schema)', async ({}) => {
  const api = await createApiClient();
  const userId = 2;
  const ajv = new Ajv();
  const validateSchema = ajv.compile(userSchema);

  const response = await api.get(`/api/users/${userId}`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('data');

  // Validate the response against the schema
  const valid = validateSchema(body);
  expect(valid, JSON.stringify(validateSchema.errors)).toBe(true);

  // Validate the user data
  const user = body.data;

  expect(user).toBeDefined();
  expect(user.id).toBe(userId);
  expect(user.email).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/);
  expect(user.first_name).toMatch(/^[a-zA-Z]+$/);
  expect(user.last_name).toMatch(/^[a-zA-Z]+$/);
  expect(user.avatar).toMatch(/^https?:\/\//);
});


test('POST Create User', async ({}) => {
  const api = await createApiClient();
  const data = {
    email: 'lucas@reqres.in',
    first_name: 'Lucas',
    last_name: 'Reqres',
    avatar: 'https://reqres.in/img/faces/6-image.jpg'
  };

  const response = await api.post(`/api/users`, { data: data });
  expect(response.status()).toBe(201);

  const body = await response.json();
  
  expect(body).toBeDefined();
  expect(body.email).toBe(data.email);
  expect(body.first_name).toBe(data.first_name);
  expect(body.last_name).toBe(data.last_name);
  expect(body.avatar).toBe(data.avatar);
  expect(body.id).toMatch(/^\d+$/);
  expect(body.createdAt).toBeDefined();
  expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
});


test('PUT Update User', async ({}) => {
  const api = await createApiClient();
  const userId = 2;
  
  const data = {
    email: 'lucas@reqres.in'
  };

  const response = await api.put(`/api/users/${userId}`, { data: data });
  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.email).toBe(body.email);
  expect(body.updatedAt).toBeDefined();
  expect(body.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
});


test('DELETE User', async ({}) => {
  const api = await createApiClient();
  const userId = 2;

  const response = await api.delete(`/api/users/${userId}`);
  expect(response.status()).toBe(204);
});


// A2. Authentication & Negative Testing
test('POST Register', async ({}) => {
  const api = await createApiClient();
  const data = {
    email: 'george.bluth@reqres.in',
    password: '123456',
  };

  const response = await api.post(`/api/register`, { data: data });
  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(typeof body.id).toBe('number');
  expect(body.id).toBeGreaterThan(0);

  expect(body.token).toBeDefined();
  expect(body.token).toMatch(/^[A-Za-z0-9]+$/);
});


test('POST Register without password', async ({}) => {
  const api = await createApiClient();
  const errorMessage = 'Missing password';
  const data = {
    email: 'george.bluth@reqres.in'
  };

  const response = await api.post(`/api/register`, { data: data });
  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body).toHaveProperty('error');
  expect(body.error).toBe(errorMessage);

});


test('POST Login', async ({}) => {
  const api = await createApiClient();
  const data = {
    email: 'george.bluth@reqres.in',
    password: '123456',
  };

  const response = await api.post(`/api/login`, { data: data });
  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.token).toBeDefined();
  expect(body.token).toMatch(/^[A-Za-z0-9]+$/);
});


test('POST Login without email', async ({}) => {
  const api = await createApiClient();
  const errorMessage = 'Missing email or username';
  const data = {
    password: '123456'
  };

  const response = await api.post(`/api/login`, { data: data });
  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body).toHaveProperty('error');
  expect(body.error).toBe(errorMessage);
});


// A3. Advanced Scenarios
test('GET User by id with invalid id', async ({}) => {
  const api = await createApiClient();
  const userId = 999;

  const response = await api.get(`/api/users/${userId}`);
  expect(response.status()).toBe(404);

  const body = await response.json();

  expect(body).toEqual({});
});


test('GET Users with delay', async ({}) => {
  const api = await createApiClient();
  const delay = 3;
  const reasonableDelay = 5000;
  
  const startTime = Date.now();
  const response = await api.get(`/api/users?delay=${delay}`);
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  expect(response.status()).toBe(200);
  expect(responseTime).toBeGreaterThanOrEqual(3000);
  expect(responseTime).toBeLessThan(reasonableDelay);

  const body = await response.json();

  expect(body.data).toBeDefined();
  expect(body.data.length).toBeGreaterThan(0);
});


test('GET User by id (data-driven)', async ({}) => {
  const api = await createApiClient();
  const users = [
    { id: 1, first_name: 'George', last_name: 'Bluth', email: 'george.bluth@reqres.in' },
    { id: 2, first_name: 'Janet', last_name: 'Weaver', email: 'janet.weaver@reqres.in' },
    { id: 3, first_name: 'Emma', last_name: 'Wong', email: 'emma.wong@reqres.in' },
    { id: 4, first_name: 'Eve', last_name: 'Holt', email: 'eve.holt@reqres.in' },
  ];

  for (const user of users) {
    const response = await api.get(`/api/users/${user.id}`);
    expect(response.status()).toBe(200);

    const body = await response.json();

    const data = body.data;
    expect(data.id).toBe(user.id);
    expect(data.first_name).toBe(user.first_name);
    expect(data.last_name).toBe(user.last_name);
    expect(data.email).toBe(user.email);
  }
});
