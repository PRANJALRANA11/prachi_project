# House Price Prediction System 🏡

A modern, decoupled Machine Learning web application designed to predict real estate prices based on the California Housing Dataset. It features a high-performance **FastAPI** backend that exposes trained predictive models and a stunning **React** (Vite) frontend with a sleek, light-themed aesthetic.

## Architecture

* **Frontend:** React Single Page Application (built with Vite) that provides an interactive dashboard with sliders for feature parameters.
* **Backend:** Python FastAPI application serving pre-trained `scikit-learn` models through a `/predict` REST endpoint.
* **Machine Learning:** Three distinct prediction models trained and evaluated:
  * Random Forest Regressor
  * Gradient Boosting Regressor (HistGradientBoosting)
  * Linear Regression

---

## Prerequisites

- **Python 3.8+**
- **Node.js 18+** & npm

## Installation & Setup

### 1. Backend Setup

Open a terminal in the project root:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install the dependencies
pip install -r requirements.txt
pip install -r backend/requirements.txt

# (Optional) Retrain the machine learning models
# This will generate the .pkl files in the /models directory
python train.py
```

### 2. Frontend Setup

Open a **second** terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install Node dependencies
npm install
```

---

## Running the Application

You need to run both the backend and frontend concurrently for the full experience.

**1. Start the FastAPI System:**
```bash
# In your first terminal (ensure your venv is activated)
python backend/api.py
```
*The API will start at `http://localhost:8000`.*

**2. Start the React Frontend:**
```bash
# In your second terminal (inside the /frontend directory)
npm run dev
```
*The React UI will start at `http://localhost:5173`. Open this URL in your web browser!*

## Features

- **Interactive Modeling:** Adjust sliders for 8 different housing attributes (Median Income, House Age, Population, etc.) and instantly see the real-time valuation updates.
- **Model Switching:** Instantly swap between the underlying predictive algorithms (Random Forest vs. Linear Regression) to compare valuation logic.
- **Responsive Design:** Designed with a smooth UI and glassmorphism styling parameters.

## License
MIT License
