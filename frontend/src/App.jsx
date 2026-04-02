import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [model, setModel] = useState("Random Forest");
  const [inputs, setInputs] = useState({
    MedInc: 3.8,
    HouseAge: 28,
    AveRooms: 5.4,
    AveBedrms: 1.0,
    Population: 1425,
    AveOccup: 3.0,
    Latitude: 35.6,
    Longitude: -119.5
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const models = ["Random Forest", "Gradient Boosting", "Linear Regression"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, ...inputs })
        });
        
        if (!response.ok) throw new Error('Failed to fetch prediction');
        
        const data = await response.json();
        setPrediction(data.prediction_usd);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPrediction();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputs, model]);

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Architecture</h2>
        <div className="input-group">
          <select value={model} onChange={e => setModel(e.target.value)}>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <h2>Parameters</h2>
        
        <div className="input-group">
          <label>Median Income (10k USD): {inputs.MedInc.toFixed(1)}</label>
          <input type="range" name="MedInc" min="0.5" max="15.0" step="0.1" value={inputs.MedInc} onChange={handleInputChange}/>
        </div>
        
        <div className="input-group">
          <label>House Age (Years): {inputs.HouseAge}</label>
          <input type="range" name="HouseAge" min="1" max="52" step="1" value={inputs.HouseAge} onChange={handleInputChange}/>
        </div>
        
        <div className="input-group">
          <label>Average Rooms: {inputs.AveRooms.toFixed(1)}</label>
          <input type="range" name="AveRooms" min="1.0" max="15.0" step="0.1" value={inputs.AveRooms} onChange={handleInputChange}/>
        </div>
        
        <div className="input-group">
          <label>Average Bedrooms: {inputs.AveBedrms.toFixed(1)}</label>
          <input type="range" name="AveBedrms" min="0.5" max="5.0" step="0.1" value={inputs.AveBedrms} onChange={handleInputChange}/>
        </div>
        
        <div className="input-group">
          <label>Population: {inputs.Population}</label>
          <input type="number" name="Population" min="10" max="35000" step="10" value={inputs.Population} onChange={handleInputChange}/>
        </div>
        
        <div className="input-group">
          <label>Average Occupancy: {inputs.AveOccup.toFixed(1)}</label>
          <input type="range" name="AveOccup" min="1.0" max="10.0" step="0.1" value={inputs.AveOccup} onChange={handleInputChange}/>
        </div>
        
        <div className="input-group">
          <label>Latitude: {inputs.Latitude.toFixed(1)}</label>
          <input type="range" name="Latitude" min="32.0" max="42.0" step="0.1" value={inputs.Latitude} onChange={handleInputChange}/>
        </div>
        
        <div className="input-group">
          <label>Longitude: {inputs.Longitude.toFixed(1)}</label>
          <input type="range" name="Longitude" min="-125.0" max="-114.0" step="0.1" value={inputs.Longitude} onChange={handleInputChange}/>
        </div>
      </div>

      <div className="main-content">
        <h1 className="main-title">House Price Prediction</h1>

     

        <div className="dashboard">
          <div className="glass-panel">
            <h3 className="panel-title">Estimated Property Value</h3>
            {error && <div style={{color: '#ff6b6b', marginTop: '1rem', fontSize: '0.9rem'}}>Backend API is offline. Please start FastAPI.</div>}
            {loading ? (
              <div className="prediction-value loading">...</div>
            ) : (
              <div className="prediction-value">
                {prediction ? `$${prediction.toLocaleString('en-US', {maximumFractionDigits: 0})}` : '$---,---'}
              </div>
            )}
            <p className="panel-title">PREDICTED BY {model.toUpperCase()}</p>
          </div>
          
          <div className="glass-panel">
             <h3 className="panel-title">Input Summary</h3>
             <div className="values-grid">
               {Object.entries(inputs).map(([key, val]) => (
                   <div key={key} className="value-item">
                     <span className="label">{key}</span>
                     <span className="val">{val}</span>
                   </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
