import requests


TRUSTED_SITES = [
    "who.int",
    "cdc.gov",
    "nih.gov",
    "mayoclinic.org",
    "nhs.uk",
    "medlineplus.gov"
]


def medical_search(query):

    search_query = query + " medical causes symptoms"

    results = []

    try:

        url = "https://api.duckduckgo.com/"

        params = {
            "q": search_query,
            "format": "json",
        }

        response = requests.get(url, params=params)

        data = response.json()

        if "RelatedTopics" in data:

            for topic in data["RelatedTopics"][:5]:

                if "Text" in topic:

                    results.append(topic["Text"])

    except Exception:

        pass

    return results