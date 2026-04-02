from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="House Price Prediction API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models at Startup
models = {}
@app.on_event("startup")
def load_models():
    # Because api.py is in backend/, models should be in backend/models/
    base_path = os.path.dirname(__file__)
    model_paths = {
        "Random Forest": os.path.join(base_path, "models", "random_forest.pkl"),
        "Gradient Boosting": os.path.join(base_path, "models", "gradient_boosting.pkl"),
        "Linear Regression": os.path.join(base_path, "models", "linear_regression.pkl")
    }
    
    for name, path in model_paths.items():
        if os.path.exists(path):
            models[name] = joblib.load(path)
            print(f"Loaded {name} model.")
        else:
            print(f"Model file not found: {path}")

# Pydantic schema for request
class PredictionRequest(BaseModel):
    model: str
    MedInc: float
    HouseAge: float
    AveRooms: float
    AveBedrms: float
    Population: float
    AveOccup: float
    Latitude: float
    Longitude: float

@app.get("/")
def read_root():
    return {"message": "House Price Prediction API is running.", "available_models": list(models.keys())}
    
@app.post("/predict")
def predict(data: PredictionRequest):
    if data.model not in models:
        raise HTTPException(status_code=400, detail=f"Model '{data.model}' not found. Available models: {list(models.keys())}")
        
    model = models[data.model]
    
    # Create DataFrame for prediction
    input_features = pd.DataFrame([{
        'MedInc': data.MedInc,
        'HouseAge': data.HouseAge,
        'AveRooms': data.AveRooms,
        'AveBedrms': data.AveBedrms,
        'Population': data.Population,
        'AveOccup': data.AveOccup,
        'Latitude': data.Latitude,
        'Longitude': data.Longitude
    }])
    
    prediction = model.predict(input_features)[0]
    
    return {
        "model_used": data.model,
        # Returning prediction in terms of dataset units (1 = $100k)
        "prediction_raw": float(prediction),
        "prediction_usd": float(prediction * 100000)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
