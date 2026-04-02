import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

def load_data():
    print("Fetching California Housing Dataset...")
    california = fetch_california_housing()
    df = pd.DataFrame(california.data, columns=california.feature_names)
    df['Target'] = california.target
    return df, california.feature_names

def train_models():
    # Make sure we have a directory for models
    os.makedirs('models', exist_ok=True)

    df, feature_names = load_data()
    X = df[feature_names]
    y = df['Target']
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    models = {
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "Gradient Boosting": HistGradientBoostingRegressor(random_state=42),
        "Linear Regression": LinearRegression()
    }

    results = {}
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        
        print(f"Evaluating {name}...")
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        results[name] = {"MSE": mse, "R2": r2}
        print(f"{name} - MSE: {mse:.4f}, R2: {r2:.4f}")
        
        # Save model
        filename = f"models/{name.lower().replace(' ', '_')}.pkl"
        joblib.dump(model, filename)
        print(f"Saved {name} to {filename}\n")

    print("Training complete! Model metric summary:")
    for name, metrics in results.items():
        print(f"{name}: MSE={metrics['MSE']:.4f}, R2={metrics['R2']:.4f}")
        
if __name__ == "__main__":
    train_models()
