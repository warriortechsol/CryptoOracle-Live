import requests
import time

# CoinLore ID mapping
symbol_to_id = {
    "BTC": 90,
    "ETH": 80,
    "DOGE": 2,
    "SOL": 48543,
    "ADA": 257
}

def fetch_coin_data(symbol, retries=3, delay=2):
    coin_id = symbol_to_id.get(symbol)
    if not coin_id:
        raise ValueError(f"[ERROR] Unsupported symbol: {symbol}")
    
    url = f"https://api.coinlore.net/api/ticker/?id={coin_id}"

    for attempt in range(retries):
        response = requests.get(url)
        print(f"[DEBUG] CoinLore response status: {response.status_code}")
        print(f"[DEBUG] Raw response content: {response.text}")

        if response.status_code == 200 and response.text.strip():
            try:
                data = response.json()
                return data[0] if isinstance(data, list) else data
            except Exception as e:
                print(f"[ERROR] Failed to parse JSON: {e}")
        else:
            print(f"[WARN] Invalid response, retrying... ({attempt + 1}/{retries})")
            time.sleep(delay)

    raise ConnectionError("[ERROR] CoinLore API failed after multiple attempts.")

def predict_price(symbol: str, current_price: float):
    try:
        print(f"[DEBUG] predict_price called with symbol={symbol}, current_price={current_price}")
        coin_data = fetch_coin_data(symbol)

        price = float(coin_data.get("price_usd", current_price))
        change_24h = float(coin_data.get("percent_change_24h", 0.0))
        volatility = abs(change_24h) / 100

        predicted = price + (volatility * price)
        print(f"[DEBUG] CoinLore price={price}, change_24h={change_24h}, predicted={predicted}")

        return round(predicted, 2)

    except Exception as e:
        print(f"[ERROR] predict_price crashed: {e}")
        raise

