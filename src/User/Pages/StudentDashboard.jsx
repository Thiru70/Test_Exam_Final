import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../StudentHeader";
import MyTests from "./MyTests";
import MyResults from "./MyResults";
import ExamInstructions from "./MyTetInstructions";
import SupportContent from "./SupportContent";
import ProfileContent from "./ProfileContent";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("My test");

  const getHeaderTitle = () => {
    switch (activeItem) {
      case "My test": return "My tests";
      case "My Results": return "My Results";
      case "Exam Instructions": return "Exam Instructions";
      case "Support": return "Support";
      case "Profile": return "Profile";
      default: return "My tests";
    }
  };

  const renderMainContent = () => {
    switch (activeItem) {
      case "My test":
        return <MyTests />;
      case "My Results":
        return <MyResults />;
      case "Exam Instructions":
        return <ExamInstructions />;
      case "Support":
        return <SupportContent />;
      case "Profile":
        return <ProfileContent />;
      default:
        return <MyTestContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getHeaderTitle()} />
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;