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
