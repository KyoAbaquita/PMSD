### **2. Database Schema**

```markdown
# Database Schema

**Last Updated:** [Date]

## Tables

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
| `project_id`          | bigint      | ID of the associated project (references projects.id)                                     |
| `name`                | VARCHAR     | Name/title of the task                                                                    |
| `description`         | text        | Detailed description of the task                                                          |
| `assigned_to`         | bigint      | ID of the user assigned to the task (references users.id), NULL if unassigned             |
| `status`              | enum        | Current status of the task: 'todo', 'in_progress', or 'done' (default: 'todo')            |
| `priority`            | enum        | Priority level of the task: 'low', 'medium', or 'high' (default: 'medium')                |
| `created_at`          | timestamp   | Date and time when the task was created                                                   |
| `updated_at`          | timestamp   | Date and time when the task was last updated                                              |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------- |

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

users "1" ◆━━ "m" projects : "◆ Composition\n(ON DELETE CASCADE[projects cannot exist without users])"
projects "1" ◇━━ "m" tasks : "◇ Aggregation\n(ON DELETE SET NULL [Tasks can exist without projects but are logically grouped])"
users "1" ━━ "m" tasks : "Association\n(ON DELETE SET NULL [tasks can exist without assignees])"

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
