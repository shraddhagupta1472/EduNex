def decide_actions(analysis):
    actions = []

    for topic in analysis["weak"]:
        actions.append(f"Revise basics of {topic} and solve easy questions")

    for topic in analysis["average"]:
        actions.append(f"Practice medium level questions for {topic}")

    for topic in analysis["strong"]:
        actions.append(f"Attempt advanced problems in {topic}")

    return actions
