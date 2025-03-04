# Novel Translation API

This API allows users to translate novels into multiple languages, automatically detects the source language, and manages a translation dictionary for consistent name and term translations.

---

## Features

- Multi-Language Support → Translate between any language pair.
- Auto-Detects Source Language → No need for manual selection.
- Novel & Chapter Management → Store translations per novel & chapter.
- Translation Dictionary → Ensures consistency in translated names and terms.
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
  "chapterNumber": 2,
  "targetLanguage": "English",
  "raw_text": "主人公进入了地下城。",
  "dictionary": { "主人公": "protagonist" }
}
```

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

- Node.js + Express.js → Backend
- Sequelize + SQLite → Database
- OpenAI API → Language Translation
- Rate Limiting (express-rate-limit) → API Protection

---

## FAQ

### 1. How does the translation API detect languages?

- OpenAI automatically detects the source language and includes it in the response.

### 2. Can I translate to multiple languages?

- Yes, simply change `"targetLanguage"` in the request.

### 3. How does the dictionary work?

- The dictionary ensures names and terms stay consistent across translations.

### 4. What happens if I translate the same chapter twice?

- The API prevents duplicate translations for the same chapter and language.

---

## Future Improvements

- Support for additional translation models
- Advanced dictionary term suggestions
- User authentication for API access

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

## Technologies Used

### Backend

- Node.js + Express.js → Server-side framework for handling API requests
- Sequelize + SQLite → ORM for database management

### AI & Language Processing

- OpenAI API → Handles text translation and language detection
- tiktoken → Token estimation for OpenAI API efficiency

### API Security & Optimization

- express-rate-limit → Protects the API from abuse by limiting requests
- dotenv → Manages environment variables securely

### Frontend Dependencies (if applicable)

- React + React DOM → Frontend framework for UI rendering
- Lucide React → Icon library for UI components

### Development & Tooling

- Vite → Development server for fast frontend builds
- TypeScript → Enhances JavaScript with static typing (used in build process)
- ESLint → Enforces code quality and best practices
- PostCSS + TailwindCSS → Stylesheets for modern UI design
