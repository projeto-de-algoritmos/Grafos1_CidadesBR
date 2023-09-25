from fastapi import HTTPException
from ..schemas.route import Coordinate, Stop
from .dataframe import DATA


class Node:
    def __init__(self, id: int, name: str, longitude: float, latitude: float):
        self.id = id
        self.name = name
        self.longitude = longitude
        self.latitude = latitude


class GraphValue:
    def __init__(self, node: Node, neighbors: list[int]):
        self.node = node
        self.neighbors = neighbors


class Graph:
    def __init__(self):
        self.graph: dict[int, GraphValue] = {}

    def _compute_distance(self, source: Node, target: Node) -> float:
        return (
            (source.longitude - target.longitude) ** 2 + (source.latitude - target.latitude) ** 2
        ) ** 0.5

    def add_node(self, node: Node):
        self.graph[node.id] = GraphValue(node, [])

    def add_neighbor(self, id: int, neighbor: int):
        self.graph[id].neighbors.append(neighbor)

    def list_nodes(self) -> list[Node]:
        return [value.node for value in self.graph.values()]

    def get_node(self, id: int) -> Node:
        return self.graph[id].node

    def search_route(self, source_id: int, target_id: int) -> list[Stop]:
        source = self.graph[source_id]
        target = self.graph[target_id]

        current_distance = self._compute_distance(source.node, target.node)
        current_node = source.node

        route = [
            Stop(
                id=current_node.id,
                name=current_node.name,
                coordinate=Coordinate(
                    latitude=current_node.latitude,
                    longitude=current_node.longitude,
                ),
            )
        ]

        while current_node.id != target.node.id:
            count = 0
            for neighbor_id in self.graph[current_node.id].neighbors:
                neighbor = self.graph[neighbor_id]

                distance = self._compute_distance(neighbor.node, target.node)
                if distance < current_distance:
                    current_distance = distance
                    current_node = neighbor.node

                    route.append(
                        Stop(
                            id=current_node.id,
                            name=current_node.name,
                            coordinate=Coordinate(
                                latitude=current_node.latitude,
                                longitude=current_node.longitude,
                            ),
                        )
                    )
                    break
                else:
                    count += 1

            if count == len(self.graph[current_node.id].neighbors):
                raise HTTPException(status_code=508, detail="Could not find a route")

        return route


def create_graph() -> Graph:
    graph = Graph()
    iterator = zip(DATA["id"], DATA["name"], DATA["lat"], DATA["lon"], DATA["neighbors"])

    for id, name, latitude, longitude, neighbors in iterator:
        node = Node(id, name, longitude, latitude)
        graph.add_node(node)

        for neighbor in neighbors[1:-1].split(", "):
            graph.add_neighbor(id, int(neighbor))

    return graph
