from fastapi import FastAPI
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
    return {"status": "ok", "source": "CoinLore"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_route(request: PredictionRequest):
    print(f"[ROUTE] /predict received: symbol='{request.symbol}' current_price={request.current_price}")
    try:
        predicted = predict_price(request.symbol, request.current_price)
        print(f"[DEBUG] Prediction result: {predicted}")
        return PredictionResponse(predicted_price=predicted)
    except Exception as e:
        print(f"[ERROR] /predict failed: {e}")
        raise

