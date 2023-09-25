from pandas import read_csv
from pathlib import Path

DATA = read_csv(Path(__file__).parent / "graph.csv")
