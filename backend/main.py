from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import networkx as nx

# Load environment variables
load_dotenv()

app = FastAPI(
    title="VectorShift Pipeline API",
    description="API for analyzing node-based pipelines",
    version=os.getenv("API_VERSION", "1.0.0")
)

# Get allowed origins from environment
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class Edge(BaseModel):
    source: str
    target: str
    id: str

class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses DFS with color-coding: 0=white (unvisited), 1=gray (visiting), 2=black (visited).
    """
    if not nodes:
        return True
    
    # Build adjacency list
    graph = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in graph:
            graph[edge.source].append(edge.target)
    
    # Color states: 0=white (unvisited), 1=gray (visiting), 2=black (visited)
    color = {node.id: 0 for node in nodes}
    
    def has_cycle(node_id: str) -> bool:
        if color[node_id] == 1:  # Back edge found - cycle detected
            return True
        if color[node_id] == 2:  # Already processed
            return False
        
        color[node_id] = 1  # Mark as being processed
        
        for neighbor in graph[node_id]:
            if neighbor in color and has_cycle(neighbor):
                return True
        
        color[node_id] = 2  # Mark as processed
        return False
    
    # Check all nodes for cycles
    for node in nodes:
        if color[node.id] == 0:  # Unvisited
            if has_cycle(node.id):
                return False
    
    return True

@app.get('/')
def read_root():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'message': 'VectorShift Pipeline API is running',
        'environment': os.getenv("ENVIRONMENT", "development"),
        'version': os.getenv("API_VERSION", "1.0.0")
    }

@app.get('/health')
def health_check():
    """Detailed health check"""
    return {
        'status': 'healthy',
        'frontend_url': frontend_url,
        'allowed_origins': allowed_origins,
        'environment': os.getenv("ENVIRONMENT", "development")
    }

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    """
    Parse the pipeline and return analysis results.
    Returns: {num_nodes: int, num_edges: int, is_dag: bool}
    """
    try:
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        dag_result = is_dag(pipeline.nodes, pipeline.edges)
        
        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": dag_result
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing pipeline: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug
    )

