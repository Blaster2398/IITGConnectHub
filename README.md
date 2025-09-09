# CampusConnectHub : A Central Platform for Student Opportunities

## Table of Contents

* [About CampusConnectHub](#about-campusconnecthub)
* [Key Features](#key-features)
* [More Features](#more-features)
* [Tech Stack Used](#tech-stack-used)
* [Future Scope & Roadmap](#future-scope--roadmap)
* [Installation](#installation)
* [Contributors](#contributors)

---

## About CampusConnectHub

CampusConnectHub is a full-stack MERN application designed to be the central hub for all student opportunities on a university campus. It digitizes and organizes the process for students to find and join fests, clubs, and technical teams, while providing team managers with a robust dashboard to recruit members in a structured manner.

It replaces fragmented communication channels like WhatsApp groups and notice boards with a single, searchable portal for opportunities. Team managers can manage recruitment seamlessly, eliminating the chaos of scattered Google Forms.

---

## Key Features

#### Student-Focused Features

* **Explore Teams:** Browse and discover teams across different campus boards (Technical, Cultural, Welfare).
* **Advanced Search & Filtering:** Find teams based on categories (Fest, Club), specific tags (e.g., *webops*, *marketing*), or available positions.
* **Detailed Team Pages:** Access descriptions, photos, and lists of all open roles.
* **Seamless Applications:** Apply for roles in just a few clicks as a logged-in student.

#### Administrative & Security Features

* **Role-Based Access Control:** Three-tiered system (*Student, BoardAdmin, SuperAdmin*).
* **Student-Led Project Postings:** Students can create their own listings for personal or academic projects.
* **Secure Admin Registration:** BoardAdmins register with a unique board-specific passkey.
* **Comprehensive Admin Dashboard:** Manage teams, roles, and applicants with an all-in-one panel.
* **Applicant Tracking:** Change applicant statuses (*Applied, Interviewing, Accepted, Rejected*).
* **SuperAdmin Panel:** Securely manage registration and deletion passkeys.

---

## More Features

* **Team & Role Management:** Admins can create, edit, and delete teams or roles.
* **Intuitive UI:** Centralized portal for both students and administrators.
* **Authentication:** Secure login and session handling with JWT.
* **Scalable System:** Ready for expansion with additional features like notifications and analytics.

---

## Tech Stack Used

* **Frontend:** React, React Context API, HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas with Mongoose ODM
* **Authentication:** JWT for sessions, bcryptjs for password hashing
* **API Communication:** Axios for HTTP requests
* **State Management:** React Context API (AuthContext for user authentication state)

---


## Future Scope & Roadmap

* **Real-Time Notifications:** In-app/email alerts for application updates or new opportunities.
* **Enhanced Student Profiles:** Portfolios, project histories, skills, and personal bios.
* **Direct Messaging System:** Built-in chat between admins and applicants.
* **Admin Analytics:** Recruitment trends, popular roles, and applicant demographics.

---

## Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate to the project folder:

```bash
cd <YOUR_PROJECT_FOLDER>
```

### Backend Setup

```bash
cd api
npm install
```

Create a `.env` file in the `api` directory with your **MongoDB connection string** and **JWT secret**.
Also Create a `.env` file in the `client` for the **REACT_APP_BACK** and put http://localhost:3000 there. 

```bash
npm start
```

### Frontend Setup

```bash
cd ../client
npm install
npm start
```

Access the application at:

```
http://localhost:3000
```

---

## Contributors

* [Aryan Patel](https://github.com/Blaster2398)

