import { MapPin, Phone, Navigation } from "lucide-react";

const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Medical Center Dr, Downtown",
    phone: "+1 (555) 123-4567",
    mapsUrl: "https://www.google.com/maps/search/City+General+Hospital",
    distance: "0.8 mi",
    specialty: "Emergency & Trauma Care",
  },
  {
    id: 2,
    name: "St. Mary's Medical Center",
    address: "456 Healthcare Blvd, Westside",
    phone: "+1 (555) 234-5678",
    mapsUrl: "https://www.google.com/maps/search/St+Mary+Medical+Center",
    distance: "1.2 mi",
    specialty: "Cardiology & Surgery",
  },
  {
    id: 3,
    name: "Memorial Hospital",
    address: "789 Wellness Ave, Northside",
    phone: "+1 (555) 345-6789",
    mapsUrl: "https://www.google.com/maps/search/Memorial+Hospital",
    distance: "1.5 mi",
    specialty: "Pediatrics & Maternity",
  },
  {
    id: 4,
    name: "University Medical Center",
    address: "321 Campus Drive, University District",
    phone: "+1 (555) 456-7890",
    mapsUrl: "https://www.google.com/maps/search/University+Medical+Center",
    distance: "2.1 mi",
    specialty: "Research & Specialty Care",
  },
  {
    id: 5,
    name: "Riverside Community Hospital",
    address: "654 River Road, Riverside",
    phone: "+1 (555) 567-8901",
    mapsUrl: "https://www.google.com/maps/search/Riverside+Community+Hospital",
    distance: "2.4 mi",
    specialty: "General Medicine",
  },
  {
    id: 6,
    name: "Central Valley Hospital",
    address: "987 Valley Street, Central District",
    phone: "+1 (555) 678-9012",
    mapsUrl: "https://www.google.com/maps/search/Central+Valley+Hospital",
    distance: "2.9 mi",
    specialty: "Orthopedics & Rehabilitation",
  },
  {
    id: 7,
    name: "Lakeside Medical Institute",
    address: "147 Lakeview Parkway, Lakeside",
    phone: "+1 (555) 789-0123",
    mapsUrl: "https://www.google.com/maps/search/Lakeside+Medical+Institute",
    distance: "3.2 mi",
    specialty: "Neurology & Mental Health",
  },
  {
    id: 8,
    name: "Horizon Healthcare Center",
    address: "258 Horizon Boulevard, Eastside",
    phone: "+1 (555) 890-1234",
    mapsUrl: "https://www.google.com/maps/search/Horizon+Healthcare+Center",
    distance: "3.6 mi",
    specialty: "Oncology & Cancer Care",
  },
];

export function Hospitals() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          Nearest Hospitals
        </h1>
        <p className="text-lg text-gray-600">
          Find the closest hospitals in your area with directions and emergency contact information
        </p>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Emergency Ambulance</h3>
              <p className="text-sm opacity-90">Available 24/7 for immediate medical emergencies</p>
            </div>
          </div>
          <a
            href="tel:911"
            className="px-8 py-4 bg-white text-cyan-700 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            Call 911
          </a>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Hospital Name and Distance */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {hospital.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {hospital.specialty}
                  </p>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                  {hospital.distance}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{hospital.address}</p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a
                  href={`tel:${hospital.phone}`}
                  className="text-sm hover:text-blue-600 transition-colors"
                >
                  {hospital.phone}
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <a
                  href={hospital.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href={`tel:${hospital.phone}`}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Call
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-cyan-900 mb-2">
          How to Use This Feature
        </h3>
        <ul className="space-y-2 text-sm text-cyan-800">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
            <span>Click "Get Directions" to open Google Maps with the hospital location</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
            <span>Use "Call" to directly contact the hospital for appointments or inquiries</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
            <span>For life-threatening emergencies, always call 911 immediately</span>
          </li>
        </ul>
      </div>
    </div>
  );
}