import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Full toolbar config matching the image
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

  const defaultAnswers = {
    single: [{ text: '', correct: false }],
    multiple: [{ text: '', correct: false }],
    truefalse: [
      { text: 'True', correct: false },
      { text: 'False', correct: false }
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

  return (
    <div className="p-6 space-y-6">
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
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add answer
            </button>
          )}
        </div>
      )}

      {/* Short answer */}
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
    </div>
  );
};

export default QuestionForm;
