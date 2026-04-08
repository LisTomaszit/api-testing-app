import { test, expect } from "@playwright/test";

const localHost = " http://127.0.0.1:5500/API-Testing-App/index.html";

test("GET Users button loads users list", async ({ page }) => {
  // intercept API
  await page.route("**/users", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          name: "Tomek",
          email: "tomek@test.pl",
        },
      ]),
    });
  });

  await page.goto(localHost);

  // await page.click("#getUsers"); // to po staremu
  await page.getByRole("button", { name: "GET Users" }).click();

  // znajduje wszystkie elementy listy
  const users = page.locator("#users li");
  // Czeka az sie pojawi i dopiero zlicza
  await expect(users.first()).toBeVisible();
  await expect(users).toHaveCount(1); // test z 1 użytkownikiem z fulfill

  // potem sprawdź ilość
  // 2 linijki kodu dla normalnego testu bez intercept
  // const count = await users.count();
  // expect(count).toBeGreaterThan(0);
});

test("POST button adds log", async ({ page }) => {
  await page.route("**/users", async (route) => {
    try {
      const request = route.request();
      //pobiera body req
      const postData = request.postDataJSON();
      expect(postData.name).toBe("Tomek");
      expect(postData.email).toBe("tomek@test.pl");
    } finally {
      await route.continue();
    }
  });

  await page.goto(localHost);

  await page.getByRole("button", { name: "POST User" }).click();

  const logs = page.locator("#log li");

  // czeka aż coś się pojawi
  await expect(logs.first()).toBeVisible();

  // pobiera tekst pierwszego loga
  // sprawdź czy zawiera "succes i Post"

  await expect(logs.first()).toContainText("Post");
  await expect(logs.first()).toContainText("success");
});

test("Clear button removes users and logs", async ({ page }) => {
  await page.goto(localHost);

  await page.click("#getUsers");

  // znajduje wyswietlonych userow i liczy ich
  const users = page.locator("#users li");
  await expect(users.first()).toBeVisible();

  const count = await users.count();
  expect(count).toBeGreaterThan(0);

  // znajdz logi i je policz
  const logs = page.locator("#log li");
  await expect(logs.first()).toBeVisible();

  const countLogs = await logs.count();
  expect(countLogs).toBeGreaterThan(0);

  //
  await page.getByRole("button", { name: "Clear" }).click();

  // Klikniecie powinno wyczyscic liste users i logow.

  await expect(users).toHaveCount(0);
  await expect(logs).toHaveCount(0);
});

// Test z symulowaniem blad API 500

test("GET Users shows error when API fails", async ({ page }) => {
  // intercept API → symulacja błędu
  await page.route("**/users", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "Server error" }),
    });
  });

  await page.goto(localHost);

  await page.getByRole("button", { name: "GET Users" }).click();

  // users NIE powinno być
  const users = page.locator("#users li");
  await expect(users).toHaveCount(0);

  // powinien pojawić się log
  const logs = page.locator("#log li");

  await expect(logs.first()).toBeVisible();

  // sprawdź czy to error
  await expect(logs.last()).toContainText(/error/i);
  // await expect(logs.last()).toHaveText(/error/i); 2 metoda
});
