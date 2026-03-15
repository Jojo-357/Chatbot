import math
import requests


def _haversine_distance(lat1, lon1, lat2, lon2):
    radius_km = 6371

    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )

    return 2 * radius_km * math.asin(math.sqrt(a))


def _fetch_hospitals_from_overpass(lat, lon):
    url = "https://overpass-api.de/api/interpreter"

    query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:5000,{lat},{lon});
      way["amenity"="hospital"](around:5000,{lat},{lon});
      relation["amenity"="hospital"](around:5000,{lat},{lon});
    );
    out center;
    """

    response = requests.post(url, data=query, timeout=15)
    response.raise_for_status()

    data = response.json()

    hospitals = []

    for item in data.get("elements", [])[:15]:

        hospital_lat = item.get("lat", item.get("center", {}).get("lat"))
        hospital_lon = item.get("lon", item.get("center", {}).get("lon"))

        if hospital_lat is None or hospital_lon is None:
            continue

        tags = item.get("tags", {})

        hospitals.append(
            {
                "name": tags.get("name", "Hospital"),
                "phone": tags.get("phone", "N/A"),
                "lat": hospital_lat,
                "lon": hospital_lon,
            }
        )

    return hospitals


def find_hospitals(lat, lon, limit=8):

    hospitals = _fetch_hospitals_from_overpass(lat, lon)

    for hospital in hospitals:
        hospital["distance_km"] = round(
            _haversine_distance(lat, lon, hospital["lat"], hospital["lon"]), 2
        )

    hospitals.sort(key=lambda hospital: hospital["distance_km"])

    return hospitals[:limit]