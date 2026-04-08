"use strict";

const getUsers = document.querySelector(`#getUsers`);
const addUser = document.querySelector(`#addUser`);
const clear = document.querySelector(`#clear`);
const users = document.querySelector("#users");
const logs = document.querySelector("#log");

const testUser = {
  name: "Tomek",
  email: "tomek@test.pl",
};

const fetchUsers = async function (url) {
  const li = document.createElement("li");
  li.textContent = "⏳ Loading...";
  logs.appendChild(li);
  try {
    const start = Date.now();
    const res = await fetch(`${url}`);
    if (res.status !== 200) throw new Error(`API error`);

    const data = await res.json();
    console.log(data);
    console.log(`Test passed`);
    li.textContent = "✅ Done!";
    // setTimeout(() => {
    //   li.textContent = "✅ Done!";
    // }, 1000);

    if (Date.now() - start > 1000) {
      li.textContent = "Error";
      throw new Error(`Api too slow`);
    }
    return data;
  } catch (err) {
    console.log(err.message);
    li.textContent = "Error";
    throw err;
  }
};

const renderUsers = function (usersData) {
  users.innerHTML = "";

  if (!Array.isArray(usersData)) {
    throw new Error("Not an array");
  }

  if (usersData.length === 0) {
    throw new Error("Empty array");
  }

  for (const user of usersData) {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.email})`;
    users.appendChild(li);
  }
};

let logsData = [];

const renderLogs = function (logsData) {
  logs.innerHTML = "";
  for (const log of logsData) {
    const li = document.createElement("li");
    li.textContent = `${log}`;
    logs.appendChild(li);
  }
};

getUsers.addEventListener("click", async () => {
  try {
    const usersData = await fetchUsers(
      "https://jsonplaceholder.typicode.com/users",
    );
    renderUsers(usersData);
  } catch (err) {
    console.error("❌ error:", err.message);
  }
});

addUser.addEventListener("click", async function () {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });
    console.log(res);
    if (res.status !== 201) {
      throw new Error("Post Failed");
    }
    const data = await res.json();
    if (data.name === "Tomek") {
      console.log("Post success");
      logsData.push(`Post success`);
    } else {
      console.log("Post failed");
      logsData.push("Post Failed");
    }
    renderLogs(logsData);
    renderUsers([testUser]);
  } catch (err) {
    console.log(err.message);
    logsData.push("❌ " + err.message);
    renderLogs(logsData);
  }
});

clear.addEventListener("click", function () {
  logsData = [];
  logs.innerHTML = "";
  users.innerHTML = "";
});
