import { useState } from "react";
import { Activity, Heart, Brain, Bone, Droplet, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface HealthData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  bloodPressure: string;
  cholesterol: string;
  bloodSugar: string;
  smoker: string;
  exercise: string;
  familyHistory: string[];
}

interface RiskAssessment {
  overallScore: number;
  riskLevel: "low" | "moderate" | "high";
  categoryScores: {
    name: string;
    score: number;
    icon: any;
    recommendations: string[];
  }[];
  strengths: string[];
  concerns: string[];
  actionPlan: string[];
}

export function HealthRiskPrediction() {
  const [showForm, setShowForm] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [healthData, setHealthData] = useState<HealthData>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    bloodPressure: "",
    cholesterol: "",
    bloodSugar: "",
    smoker: "",
    exercise: "",
    familyHistory: [],
  });

  const handleSubmit = () => {
    if (!healthData.age || !healthData.gender || !healthData.height || !healthData.weight) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);

    // Simulate AI calculation
    setTimeout(() => {
      const mockAssessment: RiskAssessment = {
        overallScore: 82,
        riskLevel: "low",
        categoryScores: [
          {
            name: "Cardiovascular Health",
            score: 85,
            icon: Heart,
            recommendations: [
              "Maintain regular cardiovascular exercise",
              "Monitor blood pressure monthly",
              "Continue heart-healthy diet",
            ],
          },
          {
            name: "Metabolic Health",
            score: 78,
            icon: Droplet,
            recommendations: [
              "Reduce sugar intake",
              "Maintain consistent meal timing",
              "Consider periodic fasting under medical supervision",
            ],
          },
          {
            name: "Neurological Health",
            score: 88,
            icon: Brain,
            recommendations: [
              "Engage in mental exercises and puzzles",
              "Maintain social connections",
              "Get 7-8 hours of quality sleep",
            ],
          },
          {
            name: "Musculoskeletal Health",
            score: 75,
            icon: Bone,
            recommendations: [
              "Incorporate strength training twice weekly",
              "Ensure adequate calcium and vitamin D intake",
              "Practice good posture",
            ],
          },
        ],
        strengths: [
          "Excellent cardiovascular fitness level",
          "Healthy BMI within optimal range",
          "Good neurological function indicators",
          "No smoking history",
        ],
        concerns: [
          "Blood sugar slightly elevated - monitor closely",
          "Low vitamin D levels detected",
          "Could benefit from increased strength training",
        ],
        actionPlan: [
          "Schedule a comprehensive check-up with your primary care physician within 3 months",
          "Start a daily 30-minute walking routine if not already exercising",
          "Increase intake of leafy greens and reduce processed foods",
          "Get blood work done every 6 months to track key markers",
          "Consider working with a nutritionist for personalized diet planning",
          "Practice stress-reduction techniques like meditation or yoga",
        ],
      };

      setAssessment(mockAssessment);
      setIsCalculating(false);
      setShowForm(false);
    }, 3000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-amber-600 bg-amber-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          Health Risk Prediction & Score
        </h1>
        <p className="text-lg text-gray-600">
          Get an AI-powered comprehensive health assessment based on your medical data
        </p>
      </div>

      {/* Input Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Your Health Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={healthData.age}
                onChange={(e) => setHealthData({ ...healthData, age: e.target.value })}
                placeholder="Enter your age"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={healthData.gender}
                onChange={(e) => setHealthData({ ...healthData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                value={healthData.height}
                onChange={(e) => setHealthData({ ...healthData, height: e.target.value })}
                placeholder="e.g., 170"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                value={healthData.weight}
                onChange={(e) => setHealthData({ ...healthData, weight: e.target.value })}
                placeholder="e.g., 70"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Pressure
              </label>
              <input
                type="text"
                value={healthData.bloodPressure}
                onChange={(e) => setHealthData({ ...healthData, bloodPressure: e.target.value })}
                placeholder="e.g., 120/80"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cholesterol Level (mg/dL)
              </label>
              <input
                type="text"
                value={healthData.cholesterol}
                onChange={(e) => setHealthData({ ...healthData, cholesterol: e.target.value })}
                placeholder="e.g., 180"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Sugar (mg/dL)
              </label>
              <input
                type="text"
                value={healthData.bloodSugar}
                onChange={(e) => setHealthData({ ...healthData, bloodSugar: e.target.value })}
                placeholder="e.g., 95"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smoking Status
              </label>
              <select
                value={healthData.smoker}
                onChange={(e) => setHealthData({ ...healthData, smoker: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                <option value="never">Never smoked</option>
                <option value="former">Former smoker</option>
                <option value="current">Current smoker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Frequency
              </label>
              <select
                value={healthData.exercise}
                onChange={(e) => setHealthData({ ...healthData, exercise: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select frequency</option>
                <option value="none">Rarely/Never</option>
                <option value="1-2">1-2 times/week</option>
                <option value="3-4">3-4 times/week</option>
                <option value="5+">5+ times/week</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Family Medical History
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Diabetes", "Heart Disease", "Cancer", "Hypertension"].map((condition) => (
                  <label key={condition} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={healthData.familyHistory.includes(condition)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHealthData({
                            ...healthData,
                            familyHistory: [...healthData.familyHistory, condition],
                          });
                        } else {
                          setHealthData({
                            ...healthData,
                            familyHistory: healthData.familyHistory.filter((c) => c !== condition),
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isCalculating}
            className="w-full mt-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Calculating Your Health Score...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Calculate Health Score
              </>
            )}
          </button>
        </div>
      )}

      {/* Assessment Results */}
      {assessment && (
        <div className="space-y-6">
          {/* Overall Score Card */}
          <div className="bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">Your Health Score</h2>
                <p className="text-blue-100">
                  Based on your comprehensive health data analysis
                </p>
                <div className={`inline-block mt-4 px-4 py-2 rounded-full font-semibold ${getRiskColor(assessment.riskLevel)} bg-white`}>
                  {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)} Risk
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-white/30"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - assessment.overallScore / 100)}`}
                      className="text-white transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{assessment.overallScore}</span>
                    <span className="text-sm text-blue-100">out of 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessment.categoryScores.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}/100
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {category.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-900">Your Strengths</h3>
              </div>
              <ul className="space-y-2">
                {assessment.strengths.map((strength, index) => (
                  <li key={index} className="flex gap-2 text-sm text-green-800">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-semibold text-amber-900">Areas to Watch</h3>
              </div>
              <ul className="space-y-2">
                {assessment.concerns.map((concern, index) => (
                  <li key={index} className="flex gap-2 text-sm text-amber-800">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-cyan-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Personalized Action Plan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.actionPlan.map((action, index) => (
                <div key={index} className="flex gap-3 p-4 bg-cyan-50 rounded-lg">
                  <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recalculate Button */}
          <button
            onClick={() => {
              setShowForm(true);
              setAssessment(null);
            }}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Recalculate with Different Data
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Medical Disclaimer</h3>
        <p className="text-sm text-amber-800">
          This health risk assessment is for informational purposes only and does not constitute medical advice. 
          The AI-generated score is based on general health guidelines and should not replace professional medical consultation. 
          Always consult with qualified healthcare providers for diagnosis and treatment decisions.
        </p>
      </div>
    </div>
  );
}