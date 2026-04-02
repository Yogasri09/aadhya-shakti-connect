import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "./dashboards/UserDashboard";
import SellerDashboard from "./dashboards/SellerDashboard";
import MentorDashboard from "./dashboards/MentorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import QuestionnaireModal from "@/components/QuestionnaireModal";

export default function DashboardHome() {
  const { profile, roles } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "User";
  const [questionnaireOpen, setQuestionnaireOpen] = useState(true);

  const showQuestionnaire = profile?.first_login === true;

  return (
    <>
      {showQuestionnaire && (
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
