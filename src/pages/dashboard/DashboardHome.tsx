import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "./dashboards/UserDashboard";
import SellerDashboard from "./dashboards/SellerDashboard";
import MentorDashboard from "./dashboards/MentorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import QuestionnaireModal from "@/components/QuestionnaireModal";
import MentorQuestionnaireModal from "@/components/MentorQuestionnaireModal";
import SellerQuestionnaireModal from "@/components/SellerQuestionnaireModal";

export default function DashboardHome() {
  const { profile, roles } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "User";
  const [questionnaireOpen, setQuestionnaireOpen] = useState(true);

  const showQuestionnaire = profile?.first_login === true;
  const isMentor = roles.includes("mentor");
  const isSeller = roles.includes("seller");

  return (
    <>
      {/* Show role-specific questionnaire on first login */}
      {showQuestionnaire && isMentor && (
        <MentorQuestionnaireModal
          open={questionnaireOpen}
          onClose={() => setQuestionnaireOpen(false)}
        />
      )}
      {showQuestionnaire && isSeller && !isMentor && (
        <SellerQuestionnaireModal
          open={questionnaireOpen}
          onClose={() => setQuestionnaireOpen(false)}
        />
      )}
      {showQuestionnaire && !isMentor && !isSeller && (
        <QuestionnaireModal
          open={questionnaireOpen}
          onClose={() => setQuestionnaireOpen(false)}
        />
      )}

      {/* Show highest-priority role dashboard */}
      {roles.includes("admin") ? <AdminDashboard name={firstName} /> :
       roles.includes("mentor") ? <MentorDashboard name={firstName} /> :
       roles.includes("seller") ? <SellerDashboard name={firstName} /> :
       <UserDashboard name={firstName} />}
    </>
  );
}
