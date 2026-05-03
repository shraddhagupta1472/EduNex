from Backend.services.llm_client import llm_call
from Backend.services.tutor_pipeline import build_prompt, process_llm_response


def generate_plan(analysis, exam="JEE/GATE", topics="", level="intermediate", duration="6 months"):
    """Generate a dynamic AI tutor response from the LLM."""
    prompt = build_prompt(analysis, exam, topics, level, duration)
    raw_output = llm_call(prompt)
    return process_llm_response(raw_output, prompt)

