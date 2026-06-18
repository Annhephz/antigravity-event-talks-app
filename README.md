# BigQuery Release Notes Tracker 🚀

A modern, high-fidelity web application built with **Python Flask** and vanilla **HTML5, CSS3, and JavaScript** that aggregates, parses, and displays the latest Google Cloud BigQuery Release Notes. It allows users to quickly view, search, and Tweet about specific updates using Twitter Web Intents.

---

## 🌟 Key Features

*   **⚡ Live Feed Parser**: Bypasses CORS constraints to fetch and parse Google's official BigQuery Release Notes Atom/RSS XML feed asynchronously.
*   **🎨 Premium Glassmorphic UI**: Features a modern, styled dark-mode design built with vanilla CSS including ambient radial background glows, blur filters, and micro-interactions.
*   **💫 Dynamic Card Entrances**: Leverages staggered slide-in animations to load release note updates smoothly.
*   **🐦 Twitter/X Sharing**: Select any release card to slide up a share panel. Instantly formats a customized tweet containing the update title, official release note link, and analytics hashtags.
*   **🔄 Instant Refresh**: Integrated spinner control to pull the latest feed data on demand.

---

## 📂 Architecture

The project splits concerns cleanly between server and client layers:

```
+---------------------------------------+
|               Client-Side             |
| (index.html, style.css, app.js)       |
+-------------------+-------------------+
                    |
          REST API  |  Renders HTML5
          Requests  |  & CSS Graphics
                    v
+-------------------+-------------------+
|               Server-Side             |
| (Flask Application: app.py)           |
+-------------------+-------------------+
                    |
                    | HTTP Get (XML Feed)
                    v
+-------------------+-------------------+
|        Google Cloud Servers           |
|  (BigQuery XML Release Notes Feed)    |
+---------------------------------------+
```

*   **Backend (Flask)**: Serves static assets, routes endpoints, and exposes `/api/notes`. It downloads the feed using `requests` and parses it into standard JSON using `feedparser`.
*   **Frontend (JS/CSS)**: Fetches JSON payloads, manipulates the DOM to render styled cards, tracks selection states, and calls the Twitter Web Intent popup.

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have **Python 3.10+** installed.

### 1. Clone the Repository
```bash
git clone https://github.com/Annhephz/antigravity-event-talks-app.git
cd antigravity-event-talks-app
```

### 2. Install Dependencies
Install Flask, requests, and feedparser using pip:
```bash
pip install -r requirements.txt
```

### 3. Run the Application
Start the Flask local development server:
```bash
python app.py
```

Open your browser and navigate to **`http://127.0.0.1:5000`**.

---

## 🛠️ Project Structure
```
bigquery-release-notes-app/
├── static/
│   ├── app.js       # Client logic, event hooks, and share actions
│   └── style.css    # Core design tokens, gradients, animations
├── templates/
│   └── index.html   # Main web interface template
├── .gitignore       # Untracked files configuration
├── app.py           # Flask entry point and feed aggregator
├── README.md        # Document guide
└── requirements.txt # Python package declarations
```
