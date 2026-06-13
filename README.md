# Live Demo:
https://omar-mohamed583.github.io/To-Do-List/

# Task Manager

A lightweight, browser-based task manager that runs entirely on the client side — no backend, no dependencies. Tasks persist across sessions using `localStorage`.

## Features

- **Add tasks** — Enter a task name and click "Add Task" to create it instantly
- **Delete tasks** — Remove any task with a single click
- **Track state** — Each task cycles through three states via a dropdown:
  - 🔴 Not Started
  - 🟡 Pending
  - 🟢 Finished
- **Live counters** — Header displays total tasks and how many are marked Finished
- **Persistent storage** — Tasks survive page refreshes via `localStorage`
- **Duplicate prevention** — Won't let you add the same task name on the same day twice
- **View Transitions API** — Smooth animated task insertion (falls back gracefully on unsupported browsers)
- **Sticky shrinking header** — Header compresses on scroll after passing a threshold
- **Color-coded borders** — Each task gets a randomly assigned accent color (teal, red, orange, or purple), distinct from the one before it

## File Structure

```
├── index.html
├── style.css
└── script.js
```

All logic lives in `script.js`. No build step, no bundler — just open `index.html` in a browser.

## How It Works

### Adding a Task

1. Type a task name into the input field
2. Click the **Add Task** button
3. The task appears at the top of the list with today's date and a "Not Started" state

### Changing Task State

Click the state badge on any task to open a dropdown with the three state options. Selecting a new state updates the task immediately and saves it. Tasks marked **Finished** get a strikethrough on their name.

### Deleting a Task

Click the **Delete** button on any task. A brief notification confirms the deletion by name.

## Storage

Tasks are stored in `localStorage` under the key `tasks` as a JSON array. Each entry has:

| Field   | Description                          |
|---------|--------------------------------------|
| `id`    | Unique hyphen-separated ID string    |
| `name`  | Task name as entered                 |
| `day`   | Day of month when created            |
| `month` | Month when created                   |
| `year`  | Year when created                    |
| `state` | `"Not Started"`, `"Pending"`, or `"Finished"` |

## Browser Compatibility

- Uses the **CSS Anchor Positioning API** (`anchor-name` / `position-anchor`) for dropdown placement — currently supported in Chromium-based browsers
- Uses the **View Transitions API** for task insertion animations — falls back to a direct DOM insert on unsupported browsers
- All other features work in any modern browser
