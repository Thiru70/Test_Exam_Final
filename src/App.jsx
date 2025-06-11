import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import HomePage from './Common/pages/HomePage';
import LoginPage from './Common/pages/LoginPage';
import EmailVerification from './Common/pages/EmailVerification';
import OtpVerification from './Common/pages/OtpVerification';
import InfoForm from './Common/pages/InfoForm';
import StudentDashboard from './User/Components/StudentDashboard';
import FaceDetectionComponent from './User/Components/FaceDetection';
import AudioDetectionComponent from './User/Components/AudioDetection';
import Instructions from './User/Components/Instructions';
import AptitudeTest from './User/Components/ApptitudeSection';
import CodingSection from './User/Components/CodingSection';
import InterviewInvitation from './User/Components/InterviewInvitation';
import FaceDetection from './User/Components/FaceDetection';
import { SelectionProcessStages } from './User/Components/SelectionProcessStages';
import MyTest from './Admin/Pages/MyTest';
import Respondents from './Admin/Pages/Respondents';
import StudentForm from './Admin/Pages/StudentForm';
import MyAccount from './Admin/Pages/MyAccount';

import Layout from './Admin/Components/Layout';
import MonacoEditor from './User/Components/MonacoCodeEditer';
import codeEditor from './User/Components/CodeEditor';
import ThankYou from './User/Components/ThankYou';

import EmailForm from './Admin/Pages/EmailForm';
import Result from './Admin/Pages/Result';
import ResultTable from './Admin/Pages/ResultTable';
import TestSheetReview from './Admin/Pages/TestSheetReview';
import Testconfiguration from './Admin/Pages/Testconfiguration';
import QuestionSet from './Admin/Pages/QuestionSet';
import InfromationForm from './Admin/Pages/Information';
import SetEligibilityCriteria from './User/Components/EligibilityCriteria';
import StudentTable from './Admin/Pages/StudentTable';
import StudentEmailForm from './Admin/Pages/StudentEmailForm';
import Emailsuccess from './Admin/Pages/Emailsuccess';
import CandidateList from './Admin/Pages/CandidateList';
import MailDashboard from './Admin/Pages/MailDashboard';
import SetCriteria from './Admin/Pages/SetCriteria';
import EligibilityCriteriaForm from './Admin/Pages/SetCriteria';


// import FaceRecognition from './User/Components/FaceRecognition';

const FaceDetectionWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateToAudio = () => navigate('/audio-detection');
  return <FaceDetectionComponent  onNavigateToAudio={handleNavigateToAudio} />;
};

const AudioDetectionWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateNext = () => navigate('/Instructions');
  return <AudioDetectionComponent onNavigateNext={handleNavigateNext} />;
};

const AptitudeTestWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateToCoding = () => navigate('/ThankYou');
  return <AptitudeTest onNavigateToCoding={handleNavigateToCoding} />;
};

const CodingSectionWrapper = () => {
  const navigate = useNavigate();
  const handleNavigateToInterview = () => navigate('/ThankYou');
  return <CodingSection onNavigateToInterview={handleNavigateToInterview} />;
};
const  InterviewInvitationWrapper = ()=>{
  const navigate = useNavigate();
  const handleNavigateToThankyou = () => navigate('/ThankYou');

return <InterviewInvitation onNavigateToThankyou={handleNavigateToThankyou} />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/information" element={<InfromationForm />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/info-form" element={<InfoForm />} />

        {/* User Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/face-detection" element={<FaceDetectionWrapper />} />
         {/* <Route path="/face-recogition" element={<FaceRecognition />} /> */}
        <Route path="/audio-detection" element={<AudioDetectionWrapper />} />
        <Route path="/Instructions" element={<Instructions />} />
        <Route path="/Aptitude-Test" element={<AptitudeTestWrapper />} />
        <Route path="/Coding-Section" element={<CodingSectionWrapper />} />
        <Route path="/interview-invitation" element={<InterviewInvitationWrapper />} />
        <Route path="/face-detect" element={<FaceDetection />} />
        <Route path="/selection-process" element={<SelectionProcessStages />} />

        {/* Admin Routes (wrapped in layout) */}
        <Route element={<Layout />}>
          <Route path="/myTest" element={<MyTest />} />
          <Route path="/respondents" element={<Respondents />} />
          <Route path="/database" element={<Result />} />
          <Route path="/StudentForm" element={<StudentForm/>} />
          <Route path="/MyAccount" element={<MyAccount/>} />
          <Route path="/emailForm" element={<EmailForm />} />
          <Route path="/resultTable" element={<ResultTable />} />
          <Route path="/testReview" element={<TestSheetReview />} />
          <Route path="/testconfiguration" element={<Testconfiguration />} />
          <Route path="/questionSet" element={<QuestionSet />} />
          <Route path="/student-form" element={<StudentTable />} />
          <Route path="/studentEmail-form" element={<StudentEmailForm />} />
          <Route path="/Emailsuccess" element={<Emailsuccess />} />
          <Route path="/candidateList" element={<CandidateList />} />
          <Route path="/MailDashborad" element={<MailDashboard />} />
          <Route path="/SetCriteria" element={<EligibilityCriteriaForm />} />

        </Route>

        {/* Fallback Route */}
        <Route path="/Monaco-editor" element={<MonacoEditor />} />
        <Route path="/code-Editor" element={<codeEditor />} />
        <Route path="/ThankYou" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App;