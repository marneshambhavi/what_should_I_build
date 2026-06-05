# What Should I Build? 🚀

A web app built to solve one of the most annoying problems every developer faces — **not knowing what to build next.**

You pick your tech stack, difficulty level, and how much time you have. The app generates a project idea for you. Simple as that.

---

## What It Does

- **Idea Generator** — Enter your preferred tech stack, difficulty (Beginner / Intermediate / Advanced), and timeline (1 day / 1 week / 1 month). Hit generate and get a project idea tailored to you.
- **Smart Suggestions** — If no exact match is found in the database, system loosens the requirements so it can still suggest a relevant project instead of showing no results.
- **Shuffle** — Not feeling the idea? You get up to 3 shuffles per generation to find something better.
- **Save Ideas** — Save your favourite generated ideas straight to your dashboard vault.
- **User Accounts** — Register and log in with username and password.
- **Mood Tracker** — A little widget on the dashboard to log how you're feeling today.
- **Achievements** — Tracks milestones like generating your first idea, staying consistent, etc.
- **My Projects** — Keep a list of the projects you're currently working on.
- **Profile Page** — View and update your profile info.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java (Jakarta Servlet API) |
| Database | MySQL |
| Frontend | HTML, CSS (Glassmorphism design) |
| Font | Audiowide (Google Fonts) |
| Icons | Font Awesome |
| Server | Apache Tomcat |

---

## Pages

- `homepage.html` — Landing page
- `register.html` — Create an account
- `login.html` — Log in
- `index.html` — Main dashboard with idea generator
- `projects.html` — View saved projects
- `achievements.html` — View unlocked achievements
- `profile.html` — View and edit profile
- `about.html` — About the project

---

## How to Run Locally

1. Clone the repo
2. Import into **IntelliJ IDEA** (or any IDE with Tomcat support)
3. Set up a **MySQL database** and update the credentials in `DBConnection.java`
4. Deploy to **Apache Tomcat**
5. Open `http://localhost:8080/whatshouldibuild/homepage.html`

> Make sure you have JDK 17+, MySQL, and Tomcat configured before running.

---

## Project Structure

```
whatshouldibuild/
├── src/                  # Java Servlet source files
│   ├── RegisterServlet.java
│   ├── LoginServlet.java
│   ├── SessionServlet.java
│   ├── AchievementsServlet.java
│   ├── DBConnection.java
│   └── ...
├── web/                  # Frontend files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── dashboard.js
│   ├── images/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   └── ...
└── README.md
```

---

## Future Enhancements

These are things I want to add eventually:

- [ ] **AI-powered idea generation** — Use an LLM API so ideas are more creative and diverse
- [ ] **Community feed** — See what ideas other users saved or are building
- [ ] **Project progress tracker** — Mark projects as in progress, completed, or abandoned with notes
- [ ] **Streak system** — Track how many days in a row you've been active
- [ ] **Dark/Light mode toggle** — Currently dark-only, would be nice to have a light mode option
- [ ] **Mobile responsive design** — The dashboard layout doesn't scale great on smaller screens yet
- [ ] **Export ideas as PDF** — Let users export their saved ideas
- [ ] **Social login** — Sign in with Google instead of going through email OTP every time

---

## Why I Built This

I kept opening a blank IDE and just staring at it. So I built something that tells me what to build. The irony is not lost on me.

---

*Built with Java, a lot of CSS tweaking, and mild frustration* 😄
