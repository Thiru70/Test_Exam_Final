import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

// Toolbar options for ReactQuill
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote", "code"],
  [{ script: "sub" }, { script: "super" }],
  ["link", "image", "video", "formula"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["clean"],
];

// Helper to strip HTML tags
const stripHtml = (html) => html.replace(/<[^>]*>?/gm, "");

// Answer defaults
const getDefaultAnswers = (type) => {
  if (type === "single") {
    return [{ text: "", correct: false }];
  }
  if (type === "multiple") {
    return [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ];
  }
  if (type === "truefalse") {
    return [
      { text: "True", correct: false },
      { text: "False", correct: false },
    ];
  }
  return [];
};

const QuestionForm = () => {
  const navigate = useNavigate();
 

  // State
  const [questionsList, setQuestionsList] = useState([]);
  const [question, setQuestion] = useState("");
  const [answerType, setAnswerType] = useState("single");
  const [difficulty, setDifficulty] = useState("easy");
  const [answers, setAnswers] = useState(getDefaultAnswers("single"));
  const [shortAnswer, setShortAnswer] = useState("");

  // Handlers
  const handleAnswerTypeChange = (type) => {
    setAnswerType(type);
    setAnswers(getDefaultAnswers(type));
    setShortAnswer("");
  };

  const handleAnswerChange = (value, index) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, text: value } : a))
    );
  };

  const handleCheckboxChange = (index) => {
    setAnswers((prev) =>
      prev.map((a, i) => {
        if (answerType === "multiple") {
          return i === index ? { ...a, correct: !a.correct } : a;
        } else {
          return { ...a, correct: i === index };
        }
      })
    );
  };

  const addAnswer = () => {
    setAnswers((prev) => [...prev, { text: "", correct: false }]);
  };

  // Format one question
  const formatQuestionForAPI = (q) => {
    let formatted = {
      question: stripHtml(q.question),
      type:
        q.answerType === "single" || q.answerType === "multiple"
          ? "MCQ"
          : q.answerType === "truefalse"
          ? "TrueFalse"
          : "Short",
      options: [],
      answer: "",
      difficulty: q.difficulty,
    };

    if (q.answerType === "single" || q.answerType === "multiple") {
      formatted.options = q.answers.map((a) => stripHtml(a.text));
      const correctAnswers = q.answers
        .map((a) => (a.correct ? stripHtml(a.text) : null))
        .filter(Boolean);
      formatted.answer =
        q.answerType === "single" ? correctAnswers[0] || "" : correctAnswers;
    } else if (q.answerType === "truefalse") {
      formatted.options = ["True", "False"];
      const correct = q.answers.find((a) => a.correct);
      formatted.answer = correct ? correct.text : "";
    } else if (q.answerType === "short") {
      formatted.answer = q.shortAnswer;
    }

    return formatted;
  };

  // Add question to local list
  const handleAddQuestion = () => {
    if (!stripHtml(question).trim()) {
      alert("Please enter the question.");
      return;
    }

    setQuestionsList((prev) => [
      ...prev,
      { question, answerType, difficulty, answers, shortAnswer },
    ]);

    // Reset form
    setQuestion("");
    setAnswers(getDefaultAnswers(answerType));
    setShortAnswer("");
  };

  // Submit all questions to API
  const handleSubmitAllQuestions = async () => {
    if (questionsList.length === 0) {
      alert("Please add at least one question.");
      return;
    }
    const createdBy = localStorage.getItem('otpEmail')
    const savedData = JSON.parse(localStorage.getItem("formData"));
    const formattedQuestions = questionsList.map(formatQuestionForAPI);

    const payload = {
      testName: savedData.name || "Untitled Test",
      duration: savedData.sessionExam.endTime - savedData.sessionExam.startTime || 45,
      passingMarks: formattedQuestions.length *2,
      shuffle: true,  
      questions: formattedQuestions,
      eligibility: {
        required: savedData.eligibility?.required || false,
        tenthPercentage: Number(savedData.eligibility?.tenthPercentage || 0),
        twelfthPercentage:Number(savedData.eligibility?.twelfthPercentage || 0)
      },
      sessionExam: {
        isSession: savedData.sessionExam?.isSession || false,
        startDate: savedData.sessionExam?.startDate || null,
        endDate: savedData.sessionExam?.endDate || null,
        startTime: savedData.sessionExam?.startTime || null,
        endTime: savedData.sessionExam?.endTime || null
      },
      createdBy
    };

    try {
      const res = await axiosInstance.post("test", payload);

      if (!res) throw new Error();
      alert("All questions submitted successfully!");
      setQuestionsList([]);
      navigate('/myTest')
    } catch {
      alert("Failed to submit questions!");
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Preview of added questions */}
      {questionsList.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4">Added Questions</h2>
          <ul className="space-y-4">
            {questionsList.map((q, idx) => (
              <li key={idx} className="p-4 border rounded bg-gray-50">
                <div
                  className="font-semibold mb-2"
                  dangerouslySetInnerHTML={{ __html: q.question }}
                />
                <div className="text-sm text-gray-600 mb-1">
                  Type: {q.answerType} | Difficulty: <b>{q.difficulty}</b>
                </div>
                <div>
                  {q.answers?.length > 0 && (
                    <ul className="list-disc ml-6">
                      {q.answers.map((a, i) => (
                        <li key={`${a.text}-${i}`}>
                          <span dangerouslySetInnerHTML={{ __html: a.text }} />{" "}
                          {a.correct ? <b>(Correct)</b> : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.answerType === "short" && q.shortAnswer && (
                    <div>
                      <b>Expected answer:</b> {q.shortAnswer}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Question editor */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          QUESTION
        </label>
        <ReactQuill
          value={question}
          onChange={setQuestion}
          modules={{ toolbar: toolbarOptions }}
          className="bg-white rounded-md shadow"
        />
      </div>

      {/* Answer Type */}
      <div className="w-60">
        <label className="block font-semibold text-gray-700 mb-2">
          Answer type
        </label>
        <select
          value={answerType}
          onChange={(e) => handleAnswerTypeChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="single">Single choice</option>
          <option value="multiple">Multiple choice</option>
          <option value="truefalse">True/False</option>
          <option value="short">Short answer</option>
        </select>
      </div>

      {/* Difficulty */}
      <div className="w-60">
        <label className="block font-semibold text-gray-700 mb-2">
          Difficulty
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Answers */}
      {answerType !== "short" && (
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Answers
          </label>
          <div className="space-y-4">
            {answers.map((ans, index) => (
              <div key={index} className="flex items-start gap-2">
                <input
                  type={answerType === "multiple" ? "checkbox" : "radio"}
                  checked={ans.correct}
                  onChange={() => handleCheckboxChange(index)}
                  className="mt-2"
                  name="answer-choice"
                />
                <div className="flex-1">
                  {answerType === "truefalse" ? (
                    <input
                      type="text"
                      value={ans.text}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-4 py-2 shadow bg-gray-100"
                    />
                  ) : (
                    <ReactQuill
                      value={ans.text}
                      onChange={(value) => handleAnswerChange(value, index)}
                      modules={{ toolbar: toolbarOptions }}
                      className="bg-white rounded-md shadow"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          {(answerType === "single" || answerType === "multiple") && (
            <button
              onClick={addAnswer}
              className="mt-4 px-4 py-2 border border-black text-black hover:bg-black hover:text-white rounded-md"
              type="button"
            >
              Add answer
            </button>
          )}
        </div>
      )}

      {/* Short answer */}
      {answerType === "short" && (
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Expected answer (optional)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 shadow"
            placeholder="Short answer (optional)"
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>

        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
          onClick={handleSubmitAllQuestions}
        >
          Submit All Questions
        </button>

        <button
          className="border border-gray-400 text-gray-700 font-bold py-2 px-6 rounded hover:bg-gray-100"
          onClick={() => {
            setQuestionsList([]);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
