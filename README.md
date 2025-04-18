# 📚 Plagiarism Checker Web App

A full-stack web application that allows users to upload documents and checks them for potential plagiarism. Built with **React**, **Tailwind CSS**, and **Flask**.

---

## 🚀 Features

- Upload DOCX or TXT files for plagiarism analysis
- Displays matching percentages and source URLs

---

## 🛠️ Tech Stack

**Frontend:**

- React
- Tailwind CSS

**Backend:**

- Flask
- MongoDB

---

### Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [pip](https://pip.pypa.io/en/stable/)

---

### ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:shawiminhas/Plagiarism-Checker.git
cd Plagiarism-Checker
```

### 🚀 Frontend Setup

1. **Navigate to the frontend directory:**

```bash
cd client
```

2. **Install the necessary dependencies:**

```bash
npm install
```

3. **Start the React development server:**

```bash
npm run dev
```

This will start the frontend application on [http://localhost:3000](http://localhost:3000).

### ⚙️ Backend Setup

1. **Navigate to the backend directory:**

```bash
cd server
```

2. **Install the necessary Python dependencies:**

```bash
pip install -r requirements.txt
```

3. **Configure environment variables**

   1. **Create a `.env` file** in the `server` directory.

   2. **Add the following keys** to your `.env` file:

```env
   WINSTON_API_KEY=your_winston_api_key_here
   MONGODB_URI=your_mongodb_connection_uri_here
```

- Replace `your_winston_api_key_here` with your actual Winston API key.
- Replace `your_mongodb_connection_uri_here` with your MongoDB URI.

4. **Run the Flask backend server:**

```bash
python app.py
```

The backend will be accessible at [http://localhost:5000](http://localhost:5000).
