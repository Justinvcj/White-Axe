def determine_next_difficulty(
    current_difficulty: str, 
    last_answer_correct: bool, 
    consecutive_correct: int, 
    consecutive_incorrect: int
) -> str:
    """
    Micro-routing algorithm mimicking basic Item Response Theory (IRT).
    Safely transitions student through [EASY -> MEDIUM -> HARD -> CHALLENGE].
    """
    tiers = ["EASY", "MEDIUM", "HARD", "CHALLENGE"]
    
    # Enforce safe bounds
    if current_difficulty not in tiers:
        current_difficulty = "EASY"
        
    current_index = tiers.index(current_difficulty)

    if last_answer_correct:
        # Step-up logic: Require 2 consecutive correct answers to elevate difficulty
        if consecutive_correct >= 2 and current_index < len(tiers) - 1:
            return tiers[current_index + 1]
        return current_difficulty
    else:
        # Step-down logic: Immediate regression on incorrect to intercept conceptual gaps
        if current_index > 0:
            return tiers[current_index - 1]
        return "EASY"


def recalculate_overall_mastery(responses: list[dict]) -> float:
    """
    Computes a weighted mastery average based on question difficulty tiers.
    Correct answers at higher tiers exponentially boost the mastery score.
    """
    if not responses:
        return 0.0

    total_weight = 0.0
    earned_weight = 0.0

    # Exponential weights assigned to IRT tiers
    weight_map = {
        "EASY": 1.0,
        "MEDIUM": 2.0,
        "HARD": 4.0,
        "CHALLENGE": 8.0
    }

    for r in responses:
        is_correct = r.get("is_correct", False)
        # Safely parse complexity level
        diff = r.get("complexity_level_str", "EASY") 
        w = weight_map.get(diff, 1.0)
        
        total_weight += w
        if is_correct:
            earned_weight += w

    if total_weight == 0.0:
        return 0.0

    mastery_percentage = (earned_weight / total_weight) * 100.0
    return float(round(mastery_percentage, 2))
