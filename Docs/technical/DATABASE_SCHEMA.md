### **2. Database Schema**

````markdown
# Database Schema

**Last Updated:** [04/01/2025]

## Tables

### `users`

| Field                 | Type        | Description                                                                               |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `id`                  | bigint      | Primary key (auto-incrementing)                                                           |
| `name`                | VARCHAR     | Full name of the user                                                                     |
| `email`               | VARCHAR     | User's email address                                                                      |
| `email_verified at`   | timestamp   | Date and time when the email was verified (NULL if unverified)                            |
| `password`            | VARCHAR     | Hashed password for authentication                                                        |
| `role`                | enum        | User role: admin, project manager, team member (default), or client                       |
| `remember_token`      | VARCHAR     | When User logs in and selects "Remember Me", it generates a unique                        |
|                       |             | token and stores it in this column.                                                       |
| `created_at`          | timestamp   | Date and time when the user account was created                                           |
| `updated_at`          | timestamp   | Date and time when the user account was last updated                                      |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------- |

### `projects`

| Field                 | Type        | Description                                                                               |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `id`                  | bigint      | Primary key (auto-incrementing)                                                           |
| `name`                | VARCHAR     | Name of the project                                                                       |
| `description`         | VARCHAR     | Detailed description of the project                                                       |
| `user_id`             | bigint      | ID of the user who created/owns the project (references users.id)                         |
| `budget`              | DECIMAL     | Total budget allocated for the project                                                    |
| `status`              | enum        | Current status: pending (default), in_progress, or completed                              |
| `created_at`          | timestamp   | Date and time when the project was created                                                |
| `updated_at`          | timestamp   | Date and time when the project was last updated                                           |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------- |

### `tasks`

| Field                 | Type        | Description                                                                               |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `id`                  | bigint      | Primary key (auto-incrementing)                                                           |
| `project_id`          | bigint      | Foreign key to `projects`: ID of the associated project (references projects id)          |
| `name`                | VARCHAR     | Name/title of the task                                                                    |
| `description`         | text        | Detailed description of the task                                                          |
| `assigned_to`         | bigint      | ID of the user assigned to the task (references users.id), NULL if unassigned             |
| `status`              | enum        | Current status of the task: 'todo', 'in_progress', or 'done' (default: 'todo')            |
| `priority`            | enum        | Priority level of the task: 'low', 'medium', or 'high' (default: 'medium')                |
| `created_at`          | timestamp   | Date and time when the task was created                                                   |
| `updated_at`          | timestamp   | Date and time when the task was last updated                                              |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------- |

---

## Indexes

| Table   | Indexed Columns | Type    | Purpose                       |
| ------- | --------------- | ------- | ----------------------------- |
| `tasks` | `project_id`    | FOREIGN | Speed up task-project queries |
| `tasks` | `assigned_to`   | FOREIGN | Faster task-user lookups      |
| `users` | `email`         | UNIQUE  | Ensure no duplicate emails    |

---

## Key Relationships

- **`users` ◆━━ `projects`**

  - Composition
  - One-to-Many: A user can own multiple projects.
  - **Constraint**: `ON DELETE CASCADE` (Projects cannot exist without users).

- **`projects` ◇━━ `tasks`**

  - Aggregation
  - One-to-Many: A project contains multiple tasks.
  - **Constraint**: `ON DELETE SET NULL` (Tasks can exist without projects but are logically grouped).

- **`users` ━━ `tasks`**
  - Association
  - One-to-Many: A user can be assigned multiple tasks.
  - **Constraint**: `ON DELETE SET NULL` (Tasks become unassigned when without assignees).

---

## Example Data

### Seed a test project:

```sql
INSERT INTO projects (name, user_id, status)
VALUES ('Website Redesign', 1, 'in_progress');
```

### Seed a test task:

```sql
INSERT INTO tasks (project_id, name, priority)
VALUES (1, 'Fix header layout', 'high');
```

### Migration Commands

```bash
# Reset and seed the database:
php artisan migrate:fresh --seed

# Check pending migrations:
php artisan migrate:status
```

classDiagram
direction LR

    class users {
        +id (PK)
        +name
        +email
        +role
        +created_at
        +updated_at
    }

    class projects {
        +id (PK)
        +name
        +description
        +user_id (FK)
        +budget
        +status
        +created_at
        +updated_at
    }

    class tasks {
        +id (PK)
        +project_id (FK)
        +name
        +description
        +assigned_to (FK)
        +status
        +priority
        +created_at
        +updated_at
    }

UML DIAGRAM

| ---------------- | | ---------------- | | ---------------- |  
| users | | projects | | tasks |
| ---------------- | | ---------------- | | ---------------- |
| id (PK) | | id (PK) | | id (PK) |
| name | | name | | project_id (FK) |
| email | | description | | name |
| role | 1 m | user_id (FK) | 1 m | description |
| created_at | | budget | | assigned_to |
| updated_at | | status | | status |
| ---------------- | | created_at | | priority |
| | updated_at | | created_at |
| | ---------------- | | updated_at |
| | ---------------- |
| 1 m |
|⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯|

```

```
````
