import numpy as np

def calculate_behavioral_confidence(responses: list[dict]) -> float:
    """
    Evaluates telemetry vectors: time_taken_seconds, hints_used, and click_stream_changes.
    Returns a normalized cognitive confidence score between 0.0 and 1.0.
    """
    if not responses:
        return 0.0

    total_time = 0.0
    total_hints = 0
    total_changes = 0
    count = len(responses)

    for r in responses:
        # Extract telemetry data safely based on Phase 4 schema
        latency_ms = r.get("response_latency_ms", 0)
        time_sec = latency_ms / 1000.0
        
        data = r.get("response_data", {}) or {}
        hints = data.get("hints_used", 0)
        changes = data.get("click_stream_changes", 0)
        
        total_time += time_sec
        total_hints += hints
        total_changes += changes

    avg_time = total_time / count
    avg_hints = total_hints / count
    avg_changes = total_changes / count

    # Scoring Matrix Algorithm (BAM-E)
    # Baseline Optimal state: <30s per question, 0 hints, 0 answer changes.
    time_penalty = max(0.0, (avg_time - 30.0) * 0.01)  # 1% penalty for every second over 30s
    hint_penalty = avg_hints * 0.15                    # 15% penalty per hint usage on average
    change_penalty = avg_changes * 0.05                # 5% penalty per answer change
    
    total_penalty = time_penalty + hint_penalty + change_penalty
    
    # Bound the confidence score between 0.0 and 1.0
    confidence = max(0.0, 1.0 - total_penalty)
    return float(round(confidence, 4))


def classify_student(academic_score: float, behavioral_confidence: float) -> str:
    """
    Categorizes the student into C1 (Advanced), C2 (Developing), or C3 (Needs Support)
    using a multi-dimensional intersection of correctness vs cognitive confidence.
    
    academic_score: 0.0 to 1.0
    behavioral_confidence: 0.0 to 1.0
    """
    if academic_score >= 0.8 and behavioral_confidence >= 0.8:
        return "C1"
    elif academic_score < 0.5 and behavioral_confidence < 0.5:
        return "C3"
    else:
        # Catches mixed vectors (e.g., high academic but low confidence indicating guessing or stress)
        return "C2"


def calculate_compatibility(teacher_tier: str, ai_tier: str) -> dict:
    """
    Cross-references the blind algorithmic profile with the teacher's qualitative hypothesis.
    Returns the point allocation for the Teacher vs AI scoring system.
    """
    is_match = (teacher_tier == ai_tier)
    
    # False Positive: Teacher predicted Advanced, but AI isolated fundamental structural gaps
    is_false_positive = (teacher_tier == "C1" and ai_tier == "C3")
    
    # False Negative: Teacher predicted Support Needed, but AI detected high cognitive flow/mastery
    is_false_negative = (teacher_tier == "C3" and ai_tier == "C1")
    
    # Point Allocation Logic
    # If Match -> Teacher gets 1 point
    # If Mismatch -> AI gets 1 point (AI assumes its telemetry is the ground truth baseline)
    teacher_points = 1 if is_match else 0
    ai_points = 1 if not is_match else 0
    
    return {
        "is_match": is_match,
        "is_false_positive": is_false_positive,
        "is_false_negative": is_false_negative,
        "teacher_tier": teacher_tier,
        "ai_tier": ai_tier,
        "teacher_points": teacher_points,
        "ai_points": ai_points
    }
