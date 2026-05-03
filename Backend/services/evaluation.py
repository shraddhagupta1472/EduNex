def evaluate(answers, questions):
    """Evaluate answers against questions and return total score, topic-wise percentages, and mistakes."""
    total_score = 0
    topic_counts = {}
    mistakes = []

    for question in questions:
        question_id = question.get("id")
        correct_answer = question.get("answer")
        topic = question.get("topic")

        if topic not in topic_counts:
            topic_counts[topic] = {"correct": 0, "total": 0}

        topic_counts[topic]["total"] += 1

        selected_option = answers.get(question_id)
        if selected_option == correct_answer:
            total_score += 1
            topic_counts[topic]["correct"] += 1
        else:
            mistakes.append({
                "question_id": question_id,
                "question": question.get("question"),
                "student_answer": selected_option,
                "correct_answer": correct_answer,
                "topic": topic
            })

    topic_scores = {}
    for topic, counts in topic_counts.items():
        total = counts["total"]
        correct = counts["correct"]
        percentage = 0
        if total > 0:
            percentage = int((correct / total) * 100)
        topic_scores[topic] = percentage

    return total_score, topic_scores, mistakes
