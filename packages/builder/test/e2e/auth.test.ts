import { test, expect } from "@playwright/test"

const API_URL = process.env.API_URL || "http://localhost:8787"
const UI_URL = process.env.UI_URL || "http://localhost:3000"

test.describe("Authentication E2E", () => {
  test("should register a new user", async ({ request }) => {
    const response = await request.post(`${API_URL}/api/builder/auth/register`, {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        confirmPassword: "password123",
      },
    })

    expect(response.ok()).toBe(true)
    const data = await response.json()
    expect(data.token).toBeDefined()
    expect(data.user).toBeDefined()
  })

  test("should login with registered user", async ({ request }) => {
    const email = `logintest-${Date.now()}@example.com`

    await request.post(`${API_URL}/api/builder/auth/register`, {
      data: {
        email,
        password: "password123",
        confirmPassword: "password123",
      },
    })

    const response = await request.post(`${API_URL}/api/builder/auth/login`, {
      data: {
        email,
        password: "password123",
      },
    })

    expect(response.ok()).toBe(true)
    const data = await response.json()
    expect(data.token).toBeDefined()
  })

  test("should reject invalid credentials", async ({ request }) => {
    const response = await request.post(`${API_URL}/api/builder/auth/login`, {
      data: {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      },
    })

    expect(response.status()).toBe(401)
  })

  test("should reject mismatched passwords on register", async ({ request }) => {
    const response = await request.post(`${API_URL}/api/builder/auth/register`, {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        confirmPassword: "differentpassword",
      },
    })

    expect(response.status()).toBe(400)
  })
})
