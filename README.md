Here's a **README.md** for your **Novel Translator App**:

---

# 📖 Novel Translator App

A **React-based web application** that uses **OpenAI's GPT-4o** to translate **Chinese web novels** into **English**, ensuring cultural accuracy and consistency. The backend is powered by **Express, Sequelize (SQLite), and OpenAI's API**.

---

## 🚀 Features

- **📚 Novel Management** → Add, retrieve, and delete novels.
- **🌎 AI-Powered Translation** → Uses OpenAI's `gpt-4o` to translate novel chapters.
- **📖 Dictionary Integration** → Maintains translated terms for consistency.
- **⚡ Rate Limiting** → Prevents excessive API usage.
- **💾 SQLite Database** → Lightweight local storage.
- **🔐 Secure API Key Handling** → Uses environment variables.

---

## 🛠️ Tech Stack

### **Frontend**

- **React 18**
- **Vite** (Fast development server)
- **Lucide-react** (Icon library)
- **TailwindCSS** (For styling)

### **Backend**

- **Express** (Web framework)
- **Sequelize** (ORM for SQLite)
- **OpenAI API** (For AI translations)
- **Tiktoken** (Token estimation for AI requests)
- **Express Rate Limit** (Prevents API abuse)
- **Dotenv** (Manages environment variables)

---

## 🏗️ Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-repo/noveltranslator.git
cd noveltranslator
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Set Up Environment Variables**

Create a `.env` file in the **root directory** and add:

```sh
OPEN_AI_KEY=your_openai_api_key
PORT=8081
```

### **4️⃣ Run the Backend**

```sh
npm run dev
```

---

## 📡 API Endpoints

### **📝 Novels**

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/api/novels`     | Fetch all novels    |
| GET    | `/api/novels/:id` | Fetch a novel by ID |
| POST   | `/api/novels`     | Create a new novel  |
| DELETE | `/api/novels/:id` | Delete a novel      |

### **📖 Translations**

| Method | Endpoint                           | Description                    |
| ------ | ---------------------------------- | ------------------------------ |
| GET    | `/api/translations/novel/:novelId` | Fetch translations for a novel |
| POST   | `/api/translations/novel/:novelId` | Add a translation for a novel  |
| PUT    | `/api/translations/:id`            | Update a translation           |
| DELETE | `/api/translations/:id`            | Delete a translation           |

### **📚 Dictionary**

| Method | Endpoint                           | Description                        |
| ------ | ---------------------------------- | ---------------------------------- |
| GET    | `/api/dictionaries/novel/:novelId` | Get dictionary entries for a novel |
| POST   | `/api/dictionaries/novel/:novelId` | Add a dictionary entry             |
| PUT    | `/api/dictionaries/:id`            | Update a dictionary entry          |
| DELETE | `/api/dictionaries/:id`            | Delete a dictionary entry          |

### **🌍 AI Translation**

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/api/translate` | Translate novel content |

📌 **Note:** AI translation requires an **OpenAI API key**.

---

## 🔥 Deployment

To deploy, use **Vercel, Netlify (for frontend), or a Node.js server like Render or DigitalOcean**.

---

## 🛡️ Security & Rate Limits

- Uses **Express Rate Limit** → Prevents more than **5 translation requests per minute per IP**.
- **API Key Handling** → Ensures OpenAI credentials are **not hardcoded**.

---

## 🛠️ Development Workflow

### **Linting & Formatting**

```sh
npm run lint
```

### **Building for Production**

```sh
npm run build
```

### **Previewing Production Build**

```sh
npm run preview
```

---

## 📌 Future Improvements

- **🔍 Pagination** for large novel lists
- **📜 Versioning** for translations
- **🔗 Cloud database support** (e.g., PostgreSQL)

---

## 🤝 Contributing

1. Fork the repo 🍴
2. Create a new branch (`feature-xyz`) 🌱
3. Commit your changes ✅
4. Open a Pull Request! 🚀

---

## 📄 License

This project is licensed under the **MIT License**.

---

🎉 **Enjoy translating your favorite novels!** 🚀📖
