/**
### ✅ `uncaughtException`

> An error that was thrown but not caught by any `try...catch`.
> **Crashes the app immediately**.
> You should log it and exit the process.

```js
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
```

---

### ✅ `unhandledRejection`

> A Promise was rejected but not handled with `.catch()` or `try...catch`.
> Can cause app crashes in newer Node.js versions.
> You should catch it and exit.

```js
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
```

---

### ✅ `SIGTERM`

> Signal sent by the **OS or external system** (like Docker) to **shut down gracefully**.
> Used for clean exits.

```js
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Exiting...");
  process.exit(0);
});
```

---

### ✅ `SIGINT`

> Signal sent when the user presses **`Ctrl + C`** in the terminal.
> Used to gracefully stop the app on user interrupt.

```js
process.on("SIGINT", () => {
  console.log("SIGINT received. Cleaning up...");
  process.exit(0);
});
```

---

Let me know if you want this in a `README.md` or code snippet template!

context => process.exit(0);
| Code | Meaning                        | When to Use                         |
| ---- | ------------------------------ | ----------------------------------- |
| `0`  | ✅ **Success / Normal Exit**    | Everything went fine, no error      |
| `1`  | ❌ **Failure / Uncaught Error** | App crashed, error occurred         |
| `>1` | Custom error codes (optional)  | Used in CI/CD or advanced scripting |

 */