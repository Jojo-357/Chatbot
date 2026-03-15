import pdfplumber
import re

from services.llm_service import analyze_blood_report_with_chat_model


def extract_markers(text):
    markers = {}
    patterns = {
        "hemoglobin": r"hemoglobin[^\d]{0,20}(\d+\.?\d*)",
        "glucose": r"(?:glucose|sugar)[^\d]{0,20}(\d+\.?\d*)",
        "platelets": r"platelet[s]?[^\d]{0,20}(\d+\.?\d*)",
        "wbc": r"wbc[^\d]{0,20}(\d+\.?\d*)",
        "rbc": r"rbc[^\d]{0,20}(\d+\.?\d*)",
        "cholesterol": r"cholesterol[^\d]{0,20}(\d+\.?\d*)",
        "triglycerides": r"triglycerides[^\d]{0,20}(\d+\.?\d*)",
        "hdl": r"hdl[^\d]{0,20}(\d+\.?\d*)",
        "ldl": r"ldl[^\d]{0,20}(\d+\.?\d*)",
        "urea": r"urea[^\d]{0,20}(\d+\.?\d*)",
        "creatinine": r"creatinine[^\d]{0,20}(\d+\.?\d*)",
    }

    lower = text.lower()
    for marker, pattern in patterns.items():
        match = re.search(pattern, lower)
        if match:
            markers[marker] = float(match.group(1))

    return markers


def analyze_blood_report(file_path):
    text_parts = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            content = page.extract_text()
            if content:
                text_parts.append(content)

    report_text = "\n".join(text_parts).strip()
    markers = extract_markers(report_text)
    analysis = analyze_blood_report_with_chat_model(report_text, markers)

    return report_text, markers, analysis
