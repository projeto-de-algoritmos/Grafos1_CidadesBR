from fastapi import FastAPI
import pandas as pd
import os

app = FastAPI()

base_dir = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(base_dir, "data", "tabela.csv"))

@app.get("/city")
async def list_city():
    cities = []
    
    for id, nome in zip(df["ID"], df["NM_DISTRITO"]):
        cities.append({"id": id, "nome": nome})

    return cities

@app.get("/route/{origin}/{destiny}")
async def route(origin: str, destiny: str):
    return f"Rota de {origin} para {destiny}"