# 🎯 Review Analyzer

Aplikasi web untuk menganalisis sentimen review menggunakan AI (Hugging Face + Google Gemini).

## ✨ Fitur

- Analisis sentiment review (Positive/Negative/Neutral)
- Ekstraksi key points otomatis
- Simpan hasil ke database PostgreSQL
- Tampilkan history semua review
- Interface web yang responsif

## 🛠️ Tech Stack

**Backend:** Python Pyramid, SQLAlchemy, PostgreSQL, Alembic  
**Frontend:** React.js, Vite, Tailwind CSS  
**AI:** Hugging Face API, Google Gemini API

## 📦 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- [Hugging Face API Key](https://huggingface.co/settings/tokens)
- [Google Gemini API Key](https://makersuite.google.com/app/apikey)

## 🚀 Installation

### 1. Setup Database

```bash
psql -U postgres
CREATE DATABASE review_analyzer;
\q
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# atau
source venv/bin/activate  # Linux/Mac

pip install -e .
pip install google-generativeai psycopg2-binary

# Set API Keys
export HUGGINGFACE_API_KEY="your_key_here"
export GEMINI_API_KEY="your_key_here"

# Edit development.ini - ubah sqlalchemy.url dengan kredensial PostgreSQL Anda
# sqlalchemy.url = postgresql://postgres:password@localhost/review_analyzer

# Initialize database
alembic upgrade head

# Run server
pserve development.ini --reload
```

Backend running di: `http://localhost:6543`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend running di: `http://localhost:5173`

## 📡 API Endpoints

**POST** `/api/reviews` - Analyze dan simpan review
```json
{
  "content": "Amazing camera quality...",
  "rating": 5
}
```

**GET** `/api/reviews` - Get all reviews

**GET** `/api/reviews/{id}` - Get review by ID

## Struktur Proyek

```
.
├── .gitignore
├── README.md
├── backend/
│   ├── alembic.ini
│   ├── development.ini
│   ├── requirements.txt
│   ├── setup.py
│   ├── alembic/
│   │   ├── env.py
│   │   ├── README
│   │   ├── script.py.mako
│   │   ├── __pycache__/
│   │   └── versions/
│   │       ├── 9b70acf755c3_create_review_table.py
│   │       └── __pycache__/
│   ├── review_analyzer/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   ├── __pycache__/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── meta.py
│   │   │   ├── review.py
│   │   │   └── __pycache__/
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── ai_services.py
│   │   └── views/
│   │       ├── __init__.py
│   │       └── api.py
│   └── review_analyzer.egg-info/
│       ├── dependency_links.txt
│       ├── entry_points.txt
│       ├── not-zip-safe
│       ├── PKG-INFO
│       ├── requires.txt
│       ├── SOURCES.txt
│       └── top_level.txt
└── frontend/
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    ├── src/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── assets/
    │   ├── components/
    │   │   ├── ReviewCard.jsx
    │   │   ├── ReviewForm.jsx
    │   │   ├── ReviewList.jsx
    │   │   └── SentimentBadge.jsx
    │   └── services/
    │       └── api.js
```


## 🧪 Development

### Menjalankan Tests
```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm test
```

### Database Migrations
```bash
cd backend
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```

## 🐛 Troubleshooting

**Database connection error:**
```bash
sudo systemctl start postgresql  # Linux
brew services start postgresql   # Mac
# Windows: Start PostgreSQL service via Services
```

**react-scripts not found:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Import error backend:**
- Pastikan file `meta.py` dan `review.py` ada di `backend/review_analyzer/models/`

##  HASIL AKHIR

![alt text](https://github.com/user-attachments/assets/4964df66-8edb-47f3-acb0-8f4f3186fde3) 
 
## 📄 License

MIT License