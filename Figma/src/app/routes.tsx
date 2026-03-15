import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Hospitals } from "./pages/Hospitals";
import { ChatbotAssistant } from "./pages/ChatbotAssistant";
import { BloodReportAnalyzer } from "./pages/BloodReportAnalyzer";
import { MedicineReminder } from "./pages/MedicineReminder";
import { HealthRiskPrediction } from "./pages/HealthRiskPrediction";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "hospitals", Component: Hospitals },
      { path: "chatbot", Component: ChatbotAssistant },
      { path: "blood-analyzer", Component: BloodReportAnalyzer },
      { path: "medicine-reminder", Component: MedicineReminder },
      { path: "health-risk", Component: HealthRiskPrediction },
    ],
  },
]);
