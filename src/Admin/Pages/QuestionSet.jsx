import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
const fullToolbarOptions = [
  [{ 'undo': 'undo' }, { 'redo': 'redo' }],
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code'],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  ['link', 'image', 'video', 'formula'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'align': [] }],
  ['clean'],
];

const QuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [answerType, setAnswerType] = useState('single');
  const [answers, setAnswers] = useState([{ text: '', correct: false }]);
  const [scoreCorrect, setScoreCorrect] = useState('');
  const [scoreIncorrect, setScoreIncorrect] = useState('');
  const [showMaxScore, setShowMaxScore] = useState(false);
  const [forceAnswer, setForceAnswer] = useState(true);
  const [terminateOnWrong, setTerminateOnWrong] = useState(true);

  const navigate = useNavigate();
    // New state to store all questions
  const [questionsList, setQuestionsList] = useState([]);
const [shuffle, setShuffle] = useState(false);
  const defaultAnswers = {
    single: [{ text: '', correct: false }],
    multiple: [{ text: '', correct: false }],
    truefalse: [
      { text: 'True', correct: false },
      { text: 'False', correct: false },
    ],
    short: [],
  };

  const handleAnswerTypeChange = (value) => {
    setAnswerType(value);
    setAnswers(defaultAnswers[value]);
  };

  const addAnswer = () => {
    setAnswers([...answers, { text: '', correct: false }]);
  };

  const handleAnswerChange = (value, index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].text = value;
    setAnswers(updatedAnswers);
  };

  const handleCheckboxChange = (index) => {
    const updatedAnswers = [...answers];
    if (answerType === 'single' || answerType === 'truefalse') {
      updatedAnswers.forEach((a, i) => (a.correct = i === index));
    } else {
      updatedAnswers[index].correct = !updatedAnswers[index].correct;
    }
    setAnswers(updatedAnswers);
  };

    // Add Question handler
  const handleAddQuestion = () => {
    // Save current question to list
    setQuestionsList([
      ...questionsList,
      {
        question,
        answerType,
        answers,
        scoreCorrect,
        scoreIncorrect,
        showMaxScore,
        forceAnswer,
        terminateOnWrong,
      },
    ]);
    // Reset fields
    setQuestion('');
    setAnswerType('single');
    setAnswers(defaultAnswers['single']);
    setScoreCorrect('');
    setScoreIncorrect('');
    setShowMaxScore(false);
    setForceAnswer(false);
    setTerminateOnWrong(false);
  };
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">

      {/* Display saved questions */}
      {questionsList.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4">Added Questions</h2>
          <ul className="space-y-4">
            {questionsList.map((q, idx) => (
              <li key={idx} className="p-4 border rounded bg-gray-50">
                <div className="font-semibold mb-2" dangerouslySetInnerHTML={{ __html: q.question }} />
                <div className="text-sm text-gray-600 mb-1">Type: {q.answerType}</div>
                <div>
                  {q.answers && q.answers.length > 0 && (
                    <ul className="list-disc ml-6">
                      {q.answers.map((a, i) => (
                        <li key={i}>
                          <span dangerouslySetInnerHTML={{ __html: a.text }} /> {a.correct ? <b>(Correct)</b> : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Question */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2">QUESTION</label>
        <ReactQuill
          value={question}
          onChange={setQuestion}
          modules={{ toolbar: fullToolbarOptions }}
          className="bg-white rounded-md shadow"
        />
      </div>

      {/* Answer Type */}
      <div className="w-60">
        <label className="block font-semibold text-gray-700 mb-2">Answer type</label>
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

      {/* Answer Options */}
      {answerType !== 'short' && (
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Answers</label>
          <div className="space-y-4">
            {answers.map((ans, index) => (
              <div key={index} className="flex items-start gap-2">
                <input
                  type={answerType === 'multiple' ? 'checkbox' : 'radio'}
                  checked={ans.correct}
                  onChange={() => handleCheckboxChange(index)}
                  className="mt-2"
                />
                <div className="flex-1">
                  <ReactQuill
                    value={ans.text}
                    onChange={(value) => handleAnswerChange(value, index)}
                    modules={{ toolbar: fullToolbarOptions }}
                    className="bg-white rounded-md shadow"
                  />
                </div>
              </div>
            ))}
          </div>
          {(answerType === 'single' || answerType === 'multiple') && (
            <button
              onClick={addAnswer}
              className="mt-4 px-4 py-2 border border-black text-black hover:bg-black hover:text-white rounded-md"
            >
              Add answer
            </button>
          )}
        </div>
      )}

      {/* Short Answer */}
      {answerType === 'short' && (
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Expected answer (optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 shadow"
            placeholder="Short answer (optional)"
          />
        </div>
      )}

      <div className="flex gap-1 pt-2">
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
      
      </div>

      {/* Question Order*/}

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">Question order</h3>
      

      {/* Question Order*/}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Select one of the options:</h2>
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="shuffle"
              value="false"
              checked={!shuffle}
              onChange={() => setShuffle(false)}
              className="mr-2"
            />
            Fixed questions and answers order as defined in Questions manager
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="shuffle"
              value="true"
              checked={shuffle}
              onChange={() => setShuffle(true)}
              className="mr-2"
            />
            Random questions and answers order
          </label>
        </div>
      </div>

      </div>
      {/* Score Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">Score settings</h3>
        <p className="text-sm text-gray-600">Define the score for a correct answer. Negative points for incorrect answers can also be assigned. If you don’t want to do so, enter 0 (zero).</p>
        <div className="flex gap-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points for correct answer</label>
            <input
              type="number"
              value={scoreCorrect}
              onChange={(e) => setScoreCorrect(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points for incorrect answer</label>
            <input
              type="number"
              value={scoreIncorrect}
              onChange={(e) => setScoreIncorrect(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-40"
            />
            <p className="text-xs text-red-500 mt-1">Warning! Number of points must be negative or zero. E.g., -1</p>
          </div>
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">Display maximum possible score for this question</h3>
        <div className="space-y-3">
          <Toggle label="Display maximum possible score for this question" value={showMaxScore} onChange={setShowMaxScore} />
          <Toggle label="Force respondent to answer this question when displayed the first time" value={forceAnswer} onChange={setForceAnswer} />
          <Toggle label="Terminate the test if the answer to this question is incorrect" value={terminateOnWrong} onChange={setTerminateOnWrong} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">save</button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => navigate("/GradingCriteria")}
        >
          save and add next
        </button>
        <button className="border border-gray-400 text-gray-700 font-bold py-2 px-6 rounded hover:bg-gray-100">cancel</button>
      </div>
    </div>
  );
};

// Reusable Toggle Component
const Toggle = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between max-w-2xl">
    <span className="text-sm text-gray-700">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
      <span className="sr-only">{label}</span>
    </label>
  </div>
);

export default QuestionForm;
