**EduTask Workspace - Personal Study Task Manager**

Welcome to the **EduTask Workspace** repository! This is an interactive web application developed to fulfill the individual assignment requirements for the course **IMS566 (Advanced Web Design)**. The system is designed to help students systematically manage academic tasks, course registrations, and weekly lecture schedules within a single, highly responsive user interface.

---

**Student & Project Information**
* **Student Name:** Nurul Haffizah binti Abdul Rasid
* **Course Code:** IMS566 (Advanced Web Design)
* **Project Theme:** Personal Study Task Manager
* **Core Technologies:** HTML5, CSS3 (Bootstrap 5), JavaScript (ES6), Chart.js (Data Visualisation)

---

**Core Application Features**

1. **Multi-User Authentication & Session Management:**
   * Supports new account registration (*Create Account*) and secure log-in credentials (*Sign In*).
   * Data is strictly isolated based on the active user session. User A will not see or conflict with any data belonging to User B.

2. **Visual Dashboard (Data Visualisation):**
   * Displays real-time statistical summaries (Total Tasks, Completed Tasks, Pending Tasks, and Total Subjects).
   * Integrated a **Doughnut Chart** using **Chart.js** to visually represent task completion percentages.
   * Integrated a **Bar Chart** to dynamic display estimated workload hours distributed across registered subjects.
   * A smart *Priority Tasks View* section that lists immediate pending items with a quick "Mark Done" toggle.

3. **Course Directory Management (Subjects Register):**
   * Allows students to register unique subject codes and course titles.
   * Includes functionality to add or permanently remove course directories with live updates.

4. **Academic Task Logger:**
   * Logs upcoming academic deliverables by capturing the task name, expected workload hours, course code correlation (via a dynamic dropdown menu), and initialization status.

5. **Weekly Schedule Organiser (Timetable Maker):**
   * Maps out weekly lecture commitments structured by day (Monday to Friday), start/end times, and designated classrooms or lecture halls.

6. **Cross-Tab Real-Time Storage Synchronization:**
   * Implements a *Storage Event Listener* architecture. If the application is opened across multiple browser tabs, any operational data modification instantly synchronizes across all active tabs without requiring a manual page refresh.

---

**Data Persistence Mechanism (Web Storage)**

This project relies purely on **Client-Side Web Storage (LocalStorage)** to handle database simulations without relying on external cloud backend services (such as MySQL or Firebase).
* **Technical Constraint:** Data is physically cached directly within the local memory storage of the specific browser profile and device being utilized. Consequently, data records will not transfer if the repository is launched on an entirely different computer or via separate browser guest profiles.

---

**Important Evaluator's Testing Guide**

To ensure a seamless evaluation and grading process, the system has been pre-packaged with an **Automatic Dummy Data Injection** algorithm:

1. **Default Master Account Credentials:**
   * **Email:** `student@uitm.edu.my`
   * **Password:** `password123`
   * *Note:* This default account is pre-populated with a full suite of mock data (Subjects, Logged Tasks, Graphs, and Timetable slots) for immediate visual appraisal upon logging in.

2. **Testing Fresh Accounts:**
   * You are highly encouraged to navigate to the *"Create Account"* tab and register any new email handle.
   * Upon first-time entry, the system intelligently injects basic startup dummy data into the new account so the dashboard charts never look empty, allowing you to freely add or delete operational rows without affecting the Master Account.

---

**Repository Directory Tree**

```text
├── index.html          # Landing Page (Main Entry Point of the System)
├── login.html          # Authentication Gateway (Sign In & Sign Up)
├── dashboard.html      # Main Metrics Hub & Chart.js Implementation
├── subject.html        # Course Code Registration Screen
├── task.html           # Academic Assignment Logger Panel
├── timetable.html      # Weekly Lecture Mapping Environment
├── style.css           # Custom Responsive Stylesheet (Bootstrap 5 Overrides)
├── auth.js             # Registration Logics & Session Validation Control
├── dashboard.js        # Statistical Formulations & Chart Generation Script
├── subject.js          # Subject Directory Modification Handler
├── task.js             # Assignment Log Entry & Deletion Engine
└── timetable.js        # Timetable Grid Structuring Logic
