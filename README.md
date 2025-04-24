# Novel Translation API

This API allows users to translate novels into multiple languages, automatically detects the source language, and manages a translation dictionary for consistent name and term translations.

---

## Features

- Multi-Language Support → Translate between any language pair.
- Auto-Detects Source Language → No need for manual selection.
- Novel & Chapter Management → Store translations per novel & chapter.
- Translation Dictionary → Ensures consistency in translated names and terms.
- Chapter Deduplication → Prevents duplicate translations before using OpenAI.
- Auto-Increment Chapter Number → If not specified, it assigns the next available chapter.
- Optimized for Speed & Cost → Uses a single OpenAI API call for both translation & detection.
- Rate Limiting → Prevents API abuse.

---

## Folder Structure

```
/noveltranslatoridea
│── models/                   # Sequelize models (DB schema)
│── routes/                   # API endpoints
│   ├── novels.js             # Novel management
│   ├── translations.js       # Handles translations (CRUD)
│   ├── dictionaries.js       # Manages dictionary terms
│   ├── translate.js          # Calls OpenAI for translation & detection
│── database.sqlite           # SQLite database
│── app.js                    # Express app entry point
│── package.json              # Dependencies & scripts
│── README.md                 # Documentation
```

---

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/noveltranslator.git
cd noveltranslator
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file and add your OpenAI API key:

```ini
OPEN_AI_KEY=your-api-key-here
PORT=8081
```

### 4. Run the Server

```sh
npm start
```

Server runs on: `http://localhost:8081`

---

## API Endpoints

### Novels

| Method   | Endpoint          | Description          |
| -------- | ----------------- | -------------------- |
| `GET`    | `/api/novels`     | Get all novels       |
| `GET`    | `/api/novels/:id` | Get a specific novel |
| `POST`   | `/api/novels`     | Create a new novel   |
| `DELETE` | `/api/novels/:id` | Delete a novel       |

#### Example Request (Create Novel)

```json
{
  "title": "Solo Leveling",
  "language": "Korean"
}
```

---

### Translations

| Method | Endpoint                           | Description                  |
| ------ | ---------------------------------- | ---------------------------- |
| `GET`  | `/api/translations/novel/:novelId` | Get translations for a novel |
| `POST` | `/api/translations/novel/:novelId` | Add a new translation        |

#### Example Request (Add Translation)

```json
{
  "chapterNumber": 1,
  "translatedContent": "The hunter walked into the dungeon...",
  "sourceLanguage": "Korean",
  "targetLanguage": "English"
}
```

---

### Translation API (Main Endpoint)

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| `POST` | `/api/translate` | Translate text & auto-detect language |

#### Example Request

```json
{
  "novelId": 1,
  "targetLanguage": "English",
  "raw_text": "主人公进入了地下城。",
  "dictionary": { "主人公": "protagonist" }
}
```

- `chapterNumber` is optional. If omitted, the next chapter number will be auto-assigned.

#### Example Response

```json
{
  "success": true,
  "translated_text": "The protagonist entered the dungeon.",
  "detected_source_language": "Chinese",
  "dictionary": { "主人公": "protagonist", "地下城": "dungeon" },
  "chapterNumber": 2
}
```

---

### Dictionary API

| Method   | Endpoint                           | Description                |
| -------- | ---------------------------------- | -------------------------- |
| `GET`    | `/api/dictionaries/novel/:novelId` | Get dictionary for a novel |
| `POST`   | `/api/dictionaries/novel/:novelId` | Add a new term             |
| `PUT`    | `/api/dictionaries/:id`            | Update a dictionary term   |
| `DELETE` | `/api/dictionaries/:id`            | Delete a term              |

#### Example Request (Add Dictionary Entry)

```json
{
  "sourceTerm": "猎人",
  "targetTerm": "hunter",
  "sourceLanguage": "Chinese",
  "targetLanguage": "English"
}
```

---

## Technologies Used

### Backend

- **Node.js + Express.js** → Server-side API
- **Sequelize + SQLite** → ORM and database engine
- **dotenv** → Environment variable loader
- **express-rate-limit** → Rate limiting middleware

### AI & Token Optimization

- **OpenAI API** → Language translation and detection
- **tiktoken** → Token estimation to stay within OpenAI limits

### Dev & Build Tools

- **Vite** → Frontend dev server and build tool
- **TypeScript** → Used in build pipeline for typed code (optional in backend)
- **ESLint** → Code quality and linting
- **PostCSS + TailwindCSS** → Frontend styling (if frontend is attached)

---

## FAQ

### 1. How does the translation API detect languages?

- The OpenAI prompt includes a rule to auto-detect the source language and return it in the response.

### 2. Can I translate to multiple languages?

- Yes. Just change the `"targetLanguage"` value in your request.

### 3. How does the dictionary work?

- It ensures term consistency by storing known translations and expanding it as new names appear.

### 4. What happens if I translate the same chapter twice?

- The API checks for duplicates and prevents them **before sending requests to OpenAI** to avoid waste.

---

## Future Improvements

- User authentication and roles
- Suggested dictionary terms based on usage
- Richer chapter metadata (e.g. titles, summaries)

---

## Contributing

Pull requests are welcome! To contribute:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## License

This project is MIT Licensed.
