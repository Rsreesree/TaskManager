# Task Manager

[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.2-orange)](https://flask.palletsprojects.com/)
[![Openpyxl](https://img.shields.io/badge/Openpyxl-3.1.2-green)](https://openpyxl.readthedocs.io/)

---

## Overview

**Task Manager** is a **web-based task management application** built with **Flask**. It allows users to create, track, update, and delete tasks stored in Excel files. The app includes user authentication, task prioritization, due dates, email notifications, and a RESTful API.

It’s **mobile-friendly** and can be deployed on cloud platforms for access from any device.

---

## Features

* User registration and login with hashed passwords
* Add, update, and delete tasks with:

  * Priority (high, medium, low)
  * Category (personal, work, etc.)
  * Due date and assignee
* Task status tracking: active or completed
* Task statistics: total, completed, active, high-priority, overdue
* Email notifications for tasks using Gmail SMTP
* RESTful API endpoints for tasks and users
* Excel-based storage (`tasks.xlsx` & `users.xlsx`)
* Mobile-ready interface

---

## Technology Stack

* **Backend:** Python 3 + Flask
* **Storage:** Excel via `openpyxl`
* **Frontend:** HTML, CSS, JavaScript
* **Email Notifications:** Gmail SMTP (requires App Password)

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Rsreesree/TaskManager.git
cd flask-task-manager
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Run the application**

```bash
python app.py
```

4. **Open in browser**

```
http://127.0.0.1:5000
```

> The Excel files (`tasks.xlsx` and `users.xlsx`) will be created automatically if they do not exist.

---

## Deployment

The app can be deployed on cloud hosting services like **Render**, **Heroku**, or **PythonAnywhere** to make it accessible from **any mobile or desktop browser**.

**Render Example Start Command:**

```bash
gunicorn app:app
```

---

## API Endpoints

| Endpoint            | Method | Description                        |
| ------------------- | ------ | ---------------------------------- |
| `/api/signup`       | POST   | Register a new user                |
| `/api/login`        | POST   | Authenticate a user                |
| `/api/tasks`        | GET    | Get all tasks                      |
| `/api/tasks`        | POST   | Create a new task                  |
| `/api/tasks/<id>`   | PUT    | Update a task status               |
| `/api/tasks/<id>`   | DELETE | Delete a task                      |
| `/api/persons`      | GET    | List all persons assigned to tasks |
| `/api/send_message` | POST   | Send email notification            |
| `/api/stats`        | GET    | Get task statistics                |

---



## Notes

* Replace the email credentials in `app.py` with your Gmail and App Password for sending notifications.
* For production deployment, consider using a proper database instead of Excel for scalability.
* Make sure `gunicorn` is in `requirements.txt` for cloud deployment.

---

## License

This project is licensed under the MIT License.

---

**Enjoy managing your tasks efficiently!**
