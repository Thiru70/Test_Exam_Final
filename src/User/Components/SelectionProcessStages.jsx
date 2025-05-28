import React from "react";

export const SelectionProcessStages = () => {
  const stages = [
    {
      title: "Initial Stage",
      steps: [
        { label: "Creating the form for applicant", action: "Create" },
        { label: "Mail format for candidate", action: "Edit mail" },
      ],
      email: {
        subject: "Exciting Job Opportunity at [Company Name] – Apply Now!",
        body: `Dear [Candidate Name],

We are excited to inform you that we have an opening for the [Job Title] role at [Company Name]. We believe you could be a great fit, and we would love to invite you to apply for the position.

To apply, please click on the link below and fill out the application form. Kindly ensure that you provide your resume and all necessary details.
Application Form Link: [Link to the Form]

If you have any questions or need further assistance, feel free to contact us.
We look forward to receiving your application!

Best regards,
[Your Name]
[Company Name]
[Company Website]
[Contact Information]`,
      },
    },
    {
      title: "Second Stage",
      steps: [
        { label: "Creating ID and Password", action: "Create" },
        { label: "Creating Aptitude test", action: "Create" },
        { label: "Mail format for candidate", action: "Edit mail" },
      ],
      email: {
        subject: "We’re Reviewing Your Application at [Company Name]",
        body: `Dear [Candidate Name],

Congratulations! We are pleased to invite you to the second-round interview for the [Job Title] position at [Company Name]. We were impressed with your application and would love to move forward with the next stage.


Date & Time: [Date and Time]
Platform: [Zoom/Google Meet/etc.]

We look forward to seeing you during the second round!

Best regards,
[Your Name]
[Company Name]
[Contact Information]`,
      },
    },
    {
      title: "Third Stage",
      steps: [
        { label: "Creating Coding Test", action: "Create" },
        { label: "Mail format for candidate", action: "Edit Mail" },
      ],
      email: {
        subject: "Interview Invitation for [Job Title] Role at [Company Name]",
        body: `Dear [Candidate Name],

Congratulations! We are pleased to invite you to the second-round interview for the [Job Title] position at [Company Name]. We were impressed with your application and would love to move forward with the next stage.

Below are the details for your second-round interview/test:
Test/Interview Link: [Test Link]
Unique Candidate ID: [Generated ID]


We look forward to seeing you during the second round!

Best regards,
[Your Name]
[Company Name]
[Contact Information]`,
      }
    }
  ]

  return (
    <div className="p-8 bg-white min-h-screen">
      {stages.map((stage, stageIndex) => (
        <div key={stageIndex} className="mb-16">
  
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-sky-500 text-white text-4xl font-bold rounded-full flex items-center justify-center mr-4">
              {stageIndex + 1}
            </div>
            <h2 className="text-white text-xl rounded bg-sky-500 p-8 font-semibold w-full">
              {stage.title}
            </h2>
          </div>

          <div className="space-y-4 mb-10">
            {stage.steps.map((step, index) => (
              <div
                key={`${stage.title}-${index}`}
                className="flex items-center justify-between bg-white shadow-sm rounded-md"
              >
                <div className="flex justify-between items-center w-full bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center font-semibold text-base mr-4">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 text-sm">{step.label}</span>
                  </div>
                  <div className="pr-14">
                    <button className="bg-sky-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-sky-600 transition">
                      {step.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-sky-500 rounded-lg p-6">
            <div className="rounded-lg flex flex-col lg:flex-row gap-6">
            
              <div className="flex-1 min-w-0 bg-white p-6 rounded-tr-3xl rounded-bl-3xl">
                <p className="text-sm font-medium mb-2">
                  <span className="font-semibold">Subject:</span>{" "}
                  {stage.email.subject}
                </p>
                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed text-gray-800">
                  {stage.email.body}
                </pre>
              </div>

              <div>
                <div className="mt-20 w-full lg:w-64 h-44 bg-white border-2 border-sky-500 rounded-md px-2 text-xs text-gray-800 space-y-2 relative">
                  <div className="absolute right-3 top-3 text-gray-400 cursor-pointer">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="font-semibold mb-2">Typography</div>
                  <div className="flex items-center gap-2">
                    <label className="w-16">Font:</label>
                    <select className="border border-gray-300 rounded px-2 py-1 w-full text-xs">
                      <option>Poppins</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="border border-gray-300 rounded px-2 py-1">
                      <option>Medium</option>
                    </select>
                    <input
                      type="number"
                      min="8"
                      max="72"
                      value={15}
                      className="border border-gray-300 rounded px-2 py-1 w-12 text-center"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px]">Line height</label>
                      <input
                        type="text"
                        value="Auto"
                        className="border border-gray-300 rounded px-2 py-1 w-full text-xs"
                        readOnly
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px]">
                        Letter spacing
                      </label>
                      <input
                        type="text"
                        value="0%"
                        className="border border-gray-300 rounded px-2 py-1 w-full text-xs"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] mb-1">Alignment</label>
                    <div className="flex gap-1">
                     
                    </div>
                  </div>
                </div>
                <div className="mt-48 flex justify-end ">
                  <button className="bg-white text-sky-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
