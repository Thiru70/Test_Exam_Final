import React from "react";
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import HomePage from "./Common/pages/HomePage";
import LoginPage from "./Common/pages/LoginPage";
import EmailVerification from "./Common/pages/EmailVerification";
import OtpVerification from "./Common/pages/OtpVerification";
import InfoForm from "./Common/pages/InfoForm";
import StudentLogin from "./Common/pages/StudentLogin";
import UserRegistrationForm from "./Common/pages/StudentRegistrationForm";

import StudentDashboard from "./User/Pages/StudentDashboard";
import FaceDetectionComponent from "./User/Components/FaceDetection";
import AudioDetectionComponent from "./User/Components/AudioDetection";
import Instructions from "./User/Components/Instructions";
import AptitudeTest from "./User/Components/ApptitudeSection";
import CodingSection from "./User/Components/CodingSection";
import InterviewInvitation from "./User/Components/InterviewInvitation";
import FaceDetection from "./User/Components/FaceDetection";
import { SelectionProcessStages } from "./User/Components/SelectionProcessStages";

import MyTest from "./Admin/Pages/MyTest";
import Respondents from "./Admin/Pages/Respondents";
import StudentForm from "./Admin/Pages/StudentForm";
import MyAccount from "./Admin/Pages/MyAccount";

import Layout from "./Admin/Components/Layout";
import MonacoEditor from "./User/Components/MonacoCodeEditer";
import ThankYou from "./User/Components/ThankYou";

import EmailForm from "./Admin/Pages/EmailForm";
import Result from "./Admin/Pages/Result";
import ResultTable from "./Admin/Pages/ResultTable";
import TestSheetReview from "./Admin/Pages/TestSheetReview";
import Testconfiguration from "./Admin/Pages/Testconfiguration";
import QuestionSet from "./Admin/Pages/QuestionSet";
import InfromationForm from "./Admin/Pages/Information";
import SetEligibilityCriteria from "./User/Components/EligibilityCriteria";
import StudentTable from "./Admin/Pages/StudentTable";
import StudentEmailForm from "./Admin/Pages/StudentEmailForm";
import Emailsuccess from "./Admin/Pages/Emailsuccess";
import CandidateList from "./Admin/Pages/CandidateList";
import MailDashboard from "./Admin/Pages/MailDashboard";
import SetCriteria from "./Admin/Pages/SetCriteria";
import EligibilityCriteriaForm from "./Admin/Pages/SetCriteria";
import InformationForm from "./Admin/Pages/Information";
import GradingCriteria from "./Admin/Pages/GradingCriteria";
import UpdateTest from "./Admin/Pages/UpdateTest";
import CompanyLoginForm from "./Admin/Pages/CompanyLogin";
import CompanyForgetPassword from "./Admin/Pages/Forget-Password";
import CompanyConfirmPassword from "./Admin/Pages/Confirm-Password";
import OtpVerificationForForgetPassword from "./Admin/Pages/OtpVerificationForForgetPassword.jsx";

// import FaceRecognition from './User/Components/FaceRecognition';

const FaceDetectionWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateToAudio = () => navigate("/audio-detection");
  return <FaceDetectionComponent onNavigateToAudio={handleNavigateToAudio} />;
};

const AudioDetectionWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateNext = () => navigate("/Instructions");
  return <AudioDetectionComponent onNavigateNext={handleNavigateNext} />;
};

const AptitudeTestWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateToCoding = () => navigate("/ThankYou");
  return <AptitudeTest onNavigateToCoding={handleNavigateToCoding} />;
};

const CodingSectionWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateToInterview = () => navigate("/ThankYou");
  return <CodingSection onNavigateToInterview={handleNavigateToInterview} />;
};
const InterviewInvitationWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateToThankyou = () => navigate("/ThankYou");

  return (
    <InterviewInvitation onNavigateToThankyou={handleNavigateToThankyou} />
  );
};

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");
  console.log(token,"token")
  return token ? children : <Navigate to="/company-login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/company-login" element={<CompanyLoginForm />} />
        <Route
          path="/reset-email-verification"
          element={<CompanyForgetPassword />}
        />
        <Route path="/information" element={<InformationForm />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route
          path="/forget-password/otp-verification"
          element={<OtpVerificationForForgetPassword />}
        />
        <Route path="/reset-password" element={<CompanyConfirmPassword />} />
        <Route path="/info-form" element={<InfoForm />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route
          path="/Student-RegistrationForm"
          element={<UserRegistrationForm />}
        />

        {/* User Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/face-detection" element={<FaceDetectionWrapper />} />

        {/* <Route path="/face-recogition" element={<FaceRecognition />} /> */}
        <Route path="/audio-detection" element={<AudioDetectionWrapper />} />
        <Route path="/Instructions" element={<Instructions />} />
        <Route path="/Aptitude-Test" element={<AptitudeTestWrapper />} />
        <Route path="/Coding-Section" element={<CodingSectionWrapper />} />
        <Route
          path="/interview-invitation"
          element={<InterviewInvitationWrapper />}
        />
        <Route path="/face-detect" element={<FaceDetection />} />
        <Route path="/selection-process" element={<SelectionProcessStages />} />

        {/* Admin Routes (wrapped in layout) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/myTest" element={<MyTest />} />
          <Route path="/respondents" element={<Respondents />} />
          <Route path="/results" element={<Result />} />
          <Route path="/StudentForm" element={<StudentForm />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/emailForm" element={<EmailForm />} />
          <Route path="/resultTable" element={<ResultTable />} />
          <Route path="/testReview" element={<TestSheetReview />} />
          <Route path="/testconfiguration" element={<Testconfiguration />} />
          <Route path="/questionSet" element={<QuestionSet />} />
          <Route path="/candidateList" element={<StudentTable />} />
          <Route path="/studentEmail-form" element={<StudentEmailForm />} />
          <Route path="/Emailsuccess" element={<Emailsuccess />} />
          {/* <Route path="/candidateList" element={<CandidateList />} /> */}
          <Route path="/MailDashborad" element={<MailDashboard />} />
          <Route path="/SetCriteria" element={<EligibilityCriteriaForm />} />
          <Route path="/GradingCriteria" element={<GradingCriteria />} />
          <Route path="/UpdateTest/:testId" element={<UpdateTest />} />
          <Route path="/UpdateTest" element={<UpdateTest />} />
        </Route>

        {/* Fallback Route */}
        <Route path="/Monaco-editor" element={<MonacoEditor />} />

        <Route path="/ThankYou" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App;
