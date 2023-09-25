from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas.city import City
from .schemas.route import Stop
from .data.graph import create_graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

graph = create_graph()


@app.get("/api/city")
async def list_city() -> list[City]:
    return [
        City(
            id=node.id,
            name=node.name,
        )
        for node in graph.list_nodes()
    ]


# TODO: Implement the route endpoint
@app.get("/api/route/{origin_id}/{destiny_id}")
async def route(origin_id: int, destiny_id: int) -> list[Stop]:
    return graph.search_route(origin_id, destiny_id)
