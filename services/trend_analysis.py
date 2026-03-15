import json


def analyze_trends(previous_reports, current_markers):

    trends = []

    if not previous_reports:
        return "No previous reports available for trend analysis."

    history = []

    for report in previous_reports:

        markers = json.loads(report["markers_json"])

        history.append(markers)

    for marker, value in current_markers.items():

        past_values = []

        for report in history:

            if marker in report:
                past_values.append(report[marker])

        if not past_values:
            continue

        avg = sum(past_values) / len(past_values)

        if value > avg:
            trends.append(f"{marker} is higher than previous average.")
        elif value < avg:
            trends.append(f"{marker} is lower than previous average.")
        else:
            trends.append(f"{marker} unchanged compared to history.")

    if not trends:
        return "No clear trends detected."

    return "\n".join(trends)