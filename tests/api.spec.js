import { test, expect } from "@playwright/test";

test("GET users API", async ({ request }) => {
  const res = await request.get("https://jsonplaceholder.typicode.com/users");
  expect(res.status()).toBe(200);

  const data = await res.json();

  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
});

test("POST user API", async ({ request }) => {
  const res = await request.post("https://jsonplaceholder.typicode.com/users", {
    data: {
      name: "Tomek",
      email: "tomek@test.pl",
    },
  });

  expect(res.status()).toBe(201);

  const data = await res.json();

  expect(data.name).toBe("Tomek");
  expect(data).toHaveProperty("email");
});
