import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface AnalysisResult {
  overallStatus: "good" | "warning" | "critical";
  healthScore: number;
  findings: {
    parameter: string;
    value: string;
    status: "normal" | "high" | "low";
    recommendation: string;
  }[];
  generalRecommendations: string[];
}

export function BloodReportAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        overallStatus: "warning",
        healthScore: 78,
        findings: [
          {
            parameter: "Hemoglobin",
            value: "12.5 g/dL",
            status: "low",
            recommendation: "Increase iron-rich foods like spinach, red meat, and legumes. Consider iron supplements after consulting your doctor.",
          },
          {
            parameter: "White Blood Cell Count",
            value: "7,500 cells/mcL",
            status: "normal",
            recommendation: "Your WBC count is within normal range. Maintain a healthy immune system through balanced diet and regular exercise.",
          },
          {
            parameter: "Cholesterol (Total)",
            value: "220 mg/dL",
            status: "high",
            recommendation: "Reduce saturated fats and increase omega-3 fatty acids. Regular exercise and fiber-rich foods can help lower cholesterol.",
          },
          {
            parameter: "Blood Sugar (Fasting)",
            value: "95 mg/dL",
            status: "normal",
            recommendation: "Your blood sugar is in a healthy range. Continue monitoring and maintain a balanced diet with controlled carbohydrate intake.",
          },
          {
            parameter: "Vitamin D",
            value: "18 ng/mL",
            status: "low",
            recommendation: "Increase sun exposure (15-20 mins daily) and consume vitamin D-rich foods. Supplementation may be necessary.",
          },
        ],
        generalRecommendations: [
          "Schedule a follow-up appointment with your healthcare provider to discuss these results",
          "Incorporate more leafy greens, fruits, and whole grains into your daily diet",
          "Aim for at least 30 minutes of moderate exercise 5 days a week",
          "Stay well-hydrated by drinking 8-10 glasses of water daily",
          "Consider getting 7-8 hours of quality sleep each night",
          "Reduce stress through meditation, yoga, or other relaxation techniques",
        ],
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
      case "good":
        return "text-green-600 bg-green-100";
      case "warning":
      case "high":
      case "low":
        return "text-amber-600 bg-amber-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="w-5 h-5" />;
      case "high":
        return <TrendingUp className="w-5 h-5" />;
      case "low":
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          Blood Report Analyzer
        </h1>
        <p className="text-lg text-gray-600">
          Upload your blood test PDF to receive AI-powered health insights and personalized recommendations
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              file
                ? "border-green-300 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                {file ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <div>
                      <p className="text-lg font-semibold text-green-700">File Uploaded</p>
                      <p className="text-sm text-green-600 mt-1">{file.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                        setAnalysis(null);
                      }}
                      className="text-sm text-green-600 hover:text-green-700 underline"
                    >
                      Upload different file
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-gray-400" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Click to upload blood report
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PDF files only (Max 10MB)</p>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Analyze Button */}
          {file && !analysis && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Report...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Analyze Blood Report
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Health Score</h2>
                <p className="text-gray-600">Based on your blood test results</p>
              </div>
              <div className="text-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.healthScore / 100)}`}
                      className="text-cyan-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{analysis.healthScore}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">out of 100</p>
              </div>
            </div>
          </div>

          {/* Detailed Findings */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h2>
            <div className="space-y-4">
              {analysis.findings.map((finding, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{finding.parameter}</h3>
                      <p className="text-sm text-gray-600 mt-1">Value: {finding.value}</p>
                    </div>
                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        finding.status
                      )}`}
                    >
                      {getStatusIcon(finding.status)}
                      {finding.status.charAt(0).toUpperCase() + finding.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {finding.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* General Recommendations */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl shadow-md p-8 border border-cyan-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Path to Better Health</h2>
            <p className="text-gray-700 mb-6">
              Follow these evidence-based recommendations to improve your overall health:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.generalRecommendations.map((recommendation, index) => (
                <div key={index} className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Important Notice</h3>
        <p className="text-sm text-amber-800">
          This analysis is for informational purposes only and should not replace professional medical advice. 
          Always consult with your healthcare provider to discuss your blood test results and any health concerns.
        </p>
      </div>
    </div>
  );
}