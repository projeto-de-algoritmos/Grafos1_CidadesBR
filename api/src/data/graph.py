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

    def add_node(self, node: Node):
        self.graph[node.id] = GraphValue(node, [])

    def add_edge(self, origin: int, destiny: int):
        self.graph[origin].neighbors.append(destiny)
        self.graph[destiny].neighbors.append(origin)

    def list_nodes(self) -> list[Node]:
        return [value.node for value in self.graph.values()]

    def get_node(self, id: int) -> Node:
        return self.graph[id].node

    def dfs(self, origin: int, destiny: int) -> set[int] | None:
        visited = set()
        stack = [origin]

        while stack:
            node = stack.pop()

            if node not in visited:
                visited.add(node)

                if node == destiny:
                    return visited

                stack.extend(self.graph[node].neighbors)

        return None


def create_graph() -> Graph:
    graph = Graph()
    iterator = zip(DATA["ID"], DATA["NM_DISTRITO"], DATA["LONG"], DATA["LAT"])

    for id, name, longitude, latitude in iterator:
        node = Node(id, name, longitude, latitude)
        graph.add_node(node)

    return graph
