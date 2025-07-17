from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from predictor import predict_price

app = FastAPI()

class PredictionRequest(BaseModel):
    symbol: str
    current_price: float

class PredictionResponse(BaseModel):
    predicted_price: float

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "source": "CoinLore",
        "engine": "CryptoOracle DebugBot v1.0"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_route(request: PredictionRequest):
    print(f"[ROUTE] /predict received: symbol='{request.symbol}' current_price={request.current_price}")
    try:
        predicted = predict_price(request.symbol, request.current_price)
        print(f"[DEBUG] Prediction result: {predicted}")
        return PredictionResponse(predicted_price=predicted)
    except ValueError as ve:
        print(f"[WARN] /predict validation error: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except ConnectionError as ce:
        print(f"[WARN] /predict API error: {ce}")
        raise HTTPException(status_code=502, detail="External API failed. Try again later.")
    except Exception as e:
        print(f"[ERROR] /predict crashed: {e}")
        raise HTTPException(status_code=500, detail="Prediction engine error")

