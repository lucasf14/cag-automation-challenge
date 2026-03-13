import { test, expect } from '@playwright/test';
import { createApiClient } from '../clients/apiClient';

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


test('GET User by id', async ({}) => {
  const api = await createApiClient();
  const userId = 2;

  const response = await api.get(`/api/users/${userId}`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('data');

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
