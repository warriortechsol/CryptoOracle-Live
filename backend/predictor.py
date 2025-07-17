import requests
import time

# 🔗 CoinLore Symbol-to-ID map
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
        print(f"[DEBUG] CoinLore status={response.status_code} (attempt {attempt + 1})")
        print(f"[DEBUG] Raw response:\n{response.text}")

        if response.status_code != 200 or not response.text.strip():
            print(f"[WARN] Invalid CoinLore response — retrying...")
            time.sleep(delay)
            continue

        try:
            data = response.json()
            return data[0] if isinstance(data, list) else data
        except Exception as e:
            print(f"[ERROR] Failed to parse CoinLore JSON: {e}")
            time.sleep(delay)

    raise ConnectionError("[ERROR] CoinLore API failed after retries")

def predict_price(symbol: str, current_price: float):
    try:
        print(f"[DEBUG] predict_price(symbol={symbol}, current_price={current_price})")
        coin_data = fetch_coin_data(symbol)

        price = float(coin_data.get("price_usd", current_price))
        change_24h = float(coin_data.get("percent_change_24h", 0.0))
        volatility = abs(change_24h) / 100

        predicted = price + (volatility * price)
        print(f"[DEBUG] Fetched price={price}, change_24h={change_24h}, predicted={predicted}")

        return round(predicted, 2)

    except ValueError as ve:
        print(f"[WARN] Validation error: {ve}")
        raise
    except ConnectionError as ce:
        print(f"[WARN] API failure: {ce}")
        raise
    except Exception as e:
        print(f"[ERROR] Unexpected crash: {e}")
        raise

