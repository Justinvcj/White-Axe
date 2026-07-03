import math
from typing import List, Dict

def predict_knowledge_decay(last_mastery_score: float, days_since_test: int, halflife_days: float = 14.0) -> float:
    """
    Implements standard mathematical Ebbinghaus forgetting curve regression.
    Formula: R = e^(-t / S) where t = days_since_test, S = halflife_days (stability profile).
    Returns the estimated real-time retention probability as a percentage (0 to 100).
    """
    if days_since_test < 0:
        days_since_test = 0
        
    if halflife_days <= 0:
        halflife_days = 0.1 # Absolute floor to prevent ZeroDivisionError
        
    decay_factor = math.exp(-(days_since_test / halflife_days))
    
    # Base retention directly scales off their initial academic mastery capture point.
    current_retention = last_mastery_score * decay_factor
    
    return float(round(current_retention, 2))


def trace_knowledge_graph_risk(student_id: str, current_gaps: List[str], graph_edges: List[Dict]) -> List[Dict]:
    """
    Directed Acyclic Graph (DAG) localized traversal script.
    current_gaps: array of topic IDs where the student holds a critical C3 tier.
    graph_edges: adjacency definitions containing 'parent_topic_id' and 'child_topic_id'.
    Computes structural risk vectors and cascading failure probabilities for downstream leaf-node topics.
    """
    if not current_gaps or not graph_edges:
        return []

    # Construct memory-efficient adjacency list mapping: parent -> array of child node IDs
    adjacency = {}
    for edge in graph_edges:
        p_id = edge.get("parent_topic_id")
        c_id = edge.get("child_topic_id")
        if p_id and c_id:
            if p_id not in adjacency:
                adjacency[p_id] = []
            adjacency[p_id].append(c_id)

    at_risk_topics = {}
    
    # Depth-First Search (DFS) implementation to traverse and compute cascading failure vectors
    def dfs(node_id: str, depth: int, source_gap: str):
        children = adjacency.get(node_id, [])
        for child in children:
            if child not in at_risk_topics:
                at_risk_topics[child] = {
                    "topic_id": child,
                    "risk_probability": 0.0,
                    "root_causes": set()
                }
            
            # Distance degradation: Structural drag is highest adjacent to the gap, decaying downstream
            risk_addition = max(0.1, 0.9 - (depth * 0.15))
            current_risk = at_risk_topics[child]["risk_probability"]
            
            # Probabilistic Combination Formula: P(A U B) = 1 - (1-P(A))*(1-P(B))
            new_risk = 1.0 - ((1.0 - current_risk) * (1.0 - risk_addition))
            
            at_risk_topics[child]["risk_probability"] = new_risk
            at_risk_topics[child]["root_causes"].add(source_gap)
            
            # Recursive descent
            dfs(child, depth + 1, source_gap)

    # Initialize graph walk from every isolated foundational C3 gap
    for gap in current_gaps:
        dfs(gap, 1, gap)

    # Transform dictionary maps to clean JSON-serializable list format
    results = []
    for t_id, data in at_risk_topics.items():
        results.append({
            "target_topic_id": t_id,
            "failure_probability_percentage": round(data["risk_probability"] * 100.0, 2),
            "root_cause_gaps": list(data["root_causes"])
        })

    # Output strictly prioritized arrays isolating highest imminent drag factors first
    results.sort(key=lambda x: x["failure_probability_percentage"], reverse=True)
    return results
