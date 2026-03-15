import { Link } from "react-router";
import { 
  Hospital, 
  MessageSquare, 
  FileText, 
  Bell, 
  Activity,
  ArrowRight
} from "lucide-react";

const features = [
  {
    name: "Nearest Hospitals",
    description: "Find the 8 closest hospitals with emergency contacts and Google Maps directions",
    icon: Hospital,
    href: "/hospitals",
    color: "from-cyan-500 to-teal-500",
  },
  {
    name: "AI Chatbot Assistant",
    description: "Get instant medical advice by describing your symptoms or health queries",
    icon: MessageSquare,
    href: "/chatbot",
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Blood Report Analyzer",
    description: "Upload your blood report PDF and get personalized health recommendations",
    icon: FileText,
    href: "/blood-analyzer",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "Medicine Reminder",
    description: "Set up reminders for your medications to never miss a dose",
    icon: Bell,
    href: "/medicine-reminder",
    color: "from-teal-400 to-cyan-400",
  },
  {
    name: "Health Risk Prediction",
    description: "Get an AI-powered health score out of 100 based on your medical records",
    icon: Activity,
    href: "/health-risk",
    color: "from-cyan-500 to-blue-500",
  },
];

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Welcome to VitaNexis
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your comprehensive AI-powered healthcare assistant. Get instant medical insights, find nearby hospitals, 
          and manage your health all in one place.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.href}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="flex items-center text-cyan-600 group-hover:gap-2 transition-all">
                <span className="text-sm font-medium">Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Emergency Services</h3>
            <p className="text-sm opacity-90">Need immediate medical assistance? Call emergency services or find the nearest hospital.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:911"
              className="px-6 py-3 bg-white text-cyan-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Call 911
            </a>
            <Link
              to="/hospitals"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-semibold"
            >
              Find Hospital
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}