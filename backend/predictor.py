import requests

# CoinLore ID mapping
symbol_to_id = {
    "BTC": 90,
    "ETH": 80,
    "DOGE": 2,
    "SOL": 48543,
    "ADA": 257
}

def predict_price(symbol: str, current_price: float):
    try:
        print(f"[DEBUG] predict_price called with symbol={symbol}, current_price={current_price}")

        if symbol not in symbol_to_id:
            raise ValueError(f"Unsupported symbol: {symbol}")

        coin_id = symbol_to_id[symbol]
        url = f"https://api.coinlore.net/api/ticker/?id={coin_id}"
        response = requests.get(url)

        if response.status_code != 200:
            raise ValueError(f"CoinLore API failed: {response.status_code} - {response.text}")

        data = response.json()
        if not data or not isinstance(data, list) or "price_usd" not in data[0]:
            raise ValueError("CoinLore returned malformed data")

        coin_data = data[0]
        price = float(coin_data["price_usd"])
        change_24h = float(coin_data["percent_change_24h"])
        volatility = abs(change_24h) / 100

        # Simple prediction: tomorrow = price ± volatility adjustment
        predicted = price + (volatility * price)

        print(f"[DEBUG] CoinLore price={price}, change_24h={change_24h}, predicted={predicted}")
        return round(predicted, 2)

    except Exception as e:
        print(f"[ERROR] predict_price crashed: {e}")
        raise

