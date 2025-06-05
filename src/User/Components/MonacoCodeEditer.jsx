import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Sun, Moon, ChevronDown, ChevronUp, Send } from 'lucide-react';

// Simple Code Editor Component
const SimpleCodeEditor = ({ language, value, onChange, theme = 'dark', height = '320px' }) => {
    const handleChange = (e) => onChange?.(e.target.value);
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart: start, selectionEnd: end, value } = e.target;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            onChange(newValue);
            setTimeout(() => e.target.selectionStart = e.target.selectionEnd = start + 2, 0);
        }
    };

    return (
        <textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ height }}
            className={`w-full p-4 font-mono text-sm resize-none border-0 focus:outline-none ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
                }`}
            placeholder={`Write your ${language} code here...`}
            spellCheck={false}
        />
    );
};

// Pyodide Manager
class PyodideManager {
    constructor() {
        this.pyodide = null;
        this.isLoaded = false;
        this.loadPromise = null;
    }

    async loadPyodide() {
        if (this.isLoaded) return this.pyodide;
        if (this.loadPromise) return this.loadPromise;

        this.loadPromise = this._load();
        return this.loadPromise;
    }

    async _load() {
        try {
            if (!window.loadPyodide) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            this.pyodide = await window.loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
            });
            this.isLoaded = true;
            return this.pyodide;
        } catch (error) {
            throw new Error('Failed to load Python environment');
        }
    }

    async runPython(code, input = '') {
        if (!this.isLoaded) await this.loadPyodide();

        const output = [];
        const errors = [];
        this.pyodide.setStdout({ batched: (text) => output.push(text) });
        this.pyodide.setStderr({ batched: (text) => errors.push(text) });

        try {
            if (input.trim()) {
                const inputLines = input.split('\n').filter(line => line.trim());
                code = `
_input_values = [${inputLines.map(line => `'${line.replace(/'/g, "\\'")}'`).join(', ')}]
_input_index = 0
def input(prompt=''):
    global _input_index
    if _input_index < len(_input_values):
        value = _input_values[_input_index]
        _input_index += 1
        return value
    return ''
${code}`;
            }
            await this.pyodide.runPythonAsync(code);
            return { output: output.join('').trim(), success: true };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}

const pyodideManager = new PyodideManager();

// Mock test cases
const mockTestCases = (testCases) => testCases?.length > 0 ? testCases.map((tc, i) => ({
    id: i + 1,
    name: `Test Case ${i + 1}`,
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    description: tc.description || `Test case ${i + 1}`
})) : [
    { id: 1, name: "Test Case 1", input: "5", expectedOutput: "25", description: "Square of 5" },
    { id: 2, name: "Test Case 2", input: "3", expectedOutput: "9", description: "Square of 3" }
];

// Main CodeEditor component
const CodeEditor = ({
    question,
    codeTemplate,
    testCases,
    currentQuestionIndex = 0,
    sessionData = {},
    allQuestions = [],
    onTestResults,
    onSubmissionComplete
}) => {
    // Default code templates
    const defaultCode = {
        javascript: `function solution(input) {
    const num = parseInt(input);
    return (num * num).toString();
}

const userInput = process.env.INPUT || '';
if (userInput !== '') {
    console.log(solution(userInput));
} else {
    console.log('Error: Input is required');
}`,
        python: `def solution(input_str):
    num = int(input_str.strip())
    return str(num * num)

try:
    user_input = input("Enter input: ")
    result = solution(user_input)
    print(result)
except Exception as e:
    print(f'Error: {e}')`
    };

    // States
    const [session] = useState({
        userId: "student_001",
        testId: "test_01JWQGRNXH1VBMYSD893DG9TMF",
        startTime: new Date().toISOString(),
        warningCount: 0,
        timeRemaining: 3600,
        ...sessionData
    });

    // Persistent code storage for each question and language
    const [questionCodeState, setQuestionCodeState] = useState({});
    const [questionInputState, setQuestionInputState] = useState({});

    const [language, setLanguage] = useState('javascript');
    const [customInput, setCustomInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [showTests, setShowTests] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [pyodideStatus, setPyodideStatus] = useState('not-loaded');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [submissionError, setSubmissionError] = useState('');
    const [allTestResults, setAllTestResults] = useState({});
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();

    const testCasesState = mockTestCases(testCases);
    const problemId = question?.id || 'default_problem';

    // Generate unique key for current question + language combination
    const getCurrentStateKey = () => `${currentQuestionIndex}_${language}`;
    const getCurrentInputKey = () => `${currentQuestionIndex}`;

    // Get current code from persistent storage or use default
    const getCurrentCode = () => {
        const stateKey = getCurrentStateKey();
        if (questionCodeState[stateKey]) {
            return questionCodeState[stateKey];
        }
        // If no saved code, use template or default
        return codeTemplate || defaultCode[language];
    };

    // Get current input from persistent storage
    const getCurrentInput = () => {
        const inputKey = getCurrentInputKey();
        return questionInputState[inputKey] || '';
    };

    // Save code to persistent storage
    const saveCurrentCode = (newCode) => {
        const stateKey = getCurrentStateKey();
        setQuestionCodeState(prev => ({
            ...prev,
            [stateKey]: newCode
        }));
    };

    // Save input to persistent storage
    const saveCurrentInput = (newInput) => {
        const inputKey = getCurrentInputKey();
        setQuestionInputState(prev => ({
            ...prev,
            [inputKey]: newInput
        }));
    };

    // Current code state (derived from persistent storage)
    const code = getCurrentCode();

    // Update customInput when question changes
    useEffect(() => {
        const savedInput = getCurrentInput();
        setCustomInput(savedInput);
    }, [currentQuestionIndex]);

    // Load Python when needed
    useEffect(() => {
        if (language === 'python') {
            setPyodideStatus('loading');
            pyodideManager.loadPyodide()
                .then(() => setPyodideStatus('loaded'))
                .catch(() => setPyodideStatus('error'));
        }
    }, [language]);

    // Reset output/error states when question or language changes (but preserve code)
    useEffect(() => {
        setOutput('');
        setError('');
        setTestResults([]);
        setShowTests(false);
    }, [currentQuestionIndex, language]);

    // Initialize code when question or language changes
    useEffect(() => {
        const stateKey = getCurrentStateKey();
        if (!questionCodeState[stateKey] && (codeTemplate || defaultCode[language])) {
            // Initialize with template if not already saved
            saveCurrentCode(codeTemplate || defaultCode[language]);
        }
    }, [currentQuestionIndex, language, codeTemplate]);

    // Send results to parent
    useEffect(() => {
        if (testResults.length > 0 && onTestResults) {
            const passedTests = testResults.filter(test => test.passed).length;
            const resultData = {
                questionId: problemId,
                questionIndex: currentQuestionIndex,
                language,
                passedTests,
                totalTests: testResults.length,
                allPassed: passedTests === testResults.length,
                testResults,
                timestamp: new Date().toISOString(),
                code,
                sessionData: session
            };

            setAllTestResults(prev => ({ ...prev, [currentQuestionIndex]: resultData }));
            onTestResults(resultData);
        }
    }, [testResults, problemId, currentQuestionIndex, language, code, onTestResults, session]);

    // Execute code
    const executeCode = async (inputValue = customInput) => {
        if (language === 'javascript') {
            const logs = [];
            const customConsole = {
                log: (...args) => logs.push(args.join(' ')),
                error: (...args) => logs.push('Error: ' + args.join(' '))
            };

            try {
                const executableCode = code.replace(/process\.env\.INPUT/g, `'${inputValue}'`);
                const func = eval(`(function(console) { ${executableCode} })`);
                func(customConsole);
                return logs.join('\n');
            } catch (error) {
                throw new Error(error.message);
            }
        } else if (language === 'python') {
            if (pyodideStatus !== 'loaded') {
                throw new Error('Python environment is still loading...');
            }
            const result = await pyodideManager.runPython(code, inputValue);
            if (result.success) {
                return result.output || 'No output';
            } else {
                throw new Error(result.error);
            }
        }
    };

    // Run code
    const runCode = async () => {
        setIsRunning(true);
        setOutput('');
        setError('');

        try {
            if (language !== 'python' && !customInput.trim()) {
                throw new Error('Please provide input before running the code');
            }
            const result = await executeCode();
            setOutput(result || 'No output');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    // Run tests
    const handleRunTests = async () => {
        setIsRunning(true);
        setShowTests(true);
        setOutput('');
        setError('');

        const results = [];
        for (const testCase of testCasesState) {
            try {
                const result = await executeCode(testCase.input);
                const cleanResult = result.replace(/^Enter input: .*?\n?/, '').replace(/^Enter input: /, '').trim();
                results.push({
                    ...testCase,
                    actualOutput: cleanResult,
                    passed: cleanResult === testCase.expectedOutput
                });
            } catch (error) {
                results.push({
                    ...testCase,
                    actualOutput: `Error: ${error.message}`,
                    passed: false
                });
            }
        }

        setTestResults(results);
        setIsRunning(false);
    };

    // Reset current question's code
    const handleReset = () => {
        const resetCode = codeTemplate || defaultCode[language];
        saveCurrentCode(resetCode);
        saveCurrentInput('');
        setCustomInput('');
        setOutput('');
        setError('');
        setTestResults([]);
        setShowTests(false);
    };

    // Code change handler that saves to persistent storage
    const handleCodeChange = (newCode) => {
        saveCurrentCode(newCode);
    };

    // Input change handler that saves to persistent storage
    const handleInputChange = (newInput) => {
        setCustomInput(newInput);
        saveCurrentInput(newInput);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmissionError('');

        try {
            // Prepare submission data with ALL questions
            let questionsData;

            if (allQuestions?.length > 0) {
                console.log('Processing all questions data:', allQuestions);
                console.log('📊 Current allTestResults state:', allTestResults);

                // Use provided allQuestions data
                questionsData = allQuestions.map((q, index) => {
                    const questionTestResults = allTestResults[index];
                    console.log(`📝 Question ${index + 1}: "${q.title || q.question}"`);
                    console.log(`🔍 Test results for question ${index + 1}:`, questionTestResults);

                    const testCasesWithStatus = q.testCases?.map(tc => {
                        let status = "not_attempted";
                        if (questionTestResults?.testResults) {
                            const testResult = questionTestResults.testResults.find(tr =>
                                tr.input === tc.input && tr.expectedOutput === tc.expectedOutput
                            );
                            status = testResult ? (testResult.passed ? "pass" : "fail") : "not_attempted";
                        }
                        return {
                            input: tc.input,
                            expectedOutput: tc.expectedOutput,
                            status: status
                        };
                    }) || [];

                    const passedTests = testCasesWithStatus.filter(tc => tc.status === 'pass').length;
                    const totalTests = testCasesWithStatus.length;
                    console.log(`✅ Question ${index + 1} status: ${passedTests}/${totalTests} tests passed`);

                    return {
                        question: q.question || q.title || q.description || `Question ${index + 1}`,
                        testCases: testCasesWithStatus
                    };
                });
            } else {
                console.log('No allQuestions data found, using fallback');
                // Fallback: create a single question from current data
                questionsData = [{
                    question: question?.title || question?.question || question?.description || "Current Problem",
                    testCases: testCasesState.map(tc => {
                        const currentTestResult = testResults.find(tr => tr.input === tc.input);
                        return {
                            input: tc.input,
                            expectedOutput: tc.expectedOutput,
                            status: currentTestResult ? (currentTestResult.passed ? "pass" : "fail") : "not_attempted"
                        };
                    })
                }];
            }

            const submissionData = {
                userId: session.userId,
                startTime: session.startTime,
                warningCount: session.warningCount,
                questions: questionsData
            };

            console.log('Submitting data:', submissionData);
            console.log('Total questions being submitted:', questionsData.length);

            // Make API call
            const apiUrl = `https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/coding-test/submit/${session.testId}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    console.log('API Error Details:', errorData);
                } catch (e) {
                    errorMessage = `${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();

            console.log('🎉 Submission Successful!');
            console.log('Full Response:', result);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📊 Results Summary:');
            console.log('  Message:', result.message);
            console.log('  Status:', result.status);
            console.log('  Percentage:', result.percentage + '%');
            console.log('  Total Score:', result.totalScore);
            console.log('  Result ID:', result.resultId);
            console.log('  Time Taken:', result.timeTaken ? `${(result.timeTaken / 1000).toFixed(2)}s` : 'N/A');
            console.log('  Total Duration:', result.totalDuration ? `${result.totalDuration}s` : 'N/A');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            setSubmissionResult(result);
            onSubmissionComplete?.(result);

            // NEW: Navigate to ThankYou page after successful submission
            console.log('🚀 Navigating to ThankYou page...');
            navigate('/ThankYou', { replace: true });

        } catch (error) {
            console.error('❌ Submission Failed:', error.message);
            console.error('Full Error:', error);
            setSubmissionError(`Submission failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const passedTests = testResults.filter(test => test.passed).length;
    const totalTests = testResults.length;
    const isRunDisabled = isRunning || (language !== 'python' && !customInput.trim()) || (language === 'python' && pyodideStatus !== 'loaded');

    // Get stats for saved questions
    const getSavedQuestionsStats = () => {
        const questionIndices = new Set();
        Object.keys(questionCodeState).forEach(key => {
            const questionIndex = parseInt(key.split('_')[0]);
            questionIndices.add(questionIndex);
        });
        return {
            savedQuestions: questionIndices.size,
            totalQuestions: allQuestions?.length || 1
        };
    };

    const savedStats = getSavedQuestionsStats();

    return (
        <div className="flex flex-col gap-6 bg-white">
            {/* Main Editor Container */}
            <div className="p-6 bg-white">
                {/* Main Editor and Console */}
                <div className="flex flex-col lg:flex-row gap-6 bg-white">
                    {/* Code Editor */}
                    <div className="flex-1 bg-white">

                        {/* Header */}
                        <div className={`p-3 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <div className="flex items-center gap-4">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className={`px-3 py-1 rounded text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                                        }`}
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                </select>
                                {language === 'python' && pyodideStatus === 'loading' && (
                                    <span className="text-xs text-yellow-500">Loading Python...</span>
                                )}
                                {/* Code persistence indicator */}
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
                                        Auto-saved ({savedStats.savedQuestions}/{savedStats.totalQuestions} questions)
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                                    }`}>
                                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                                </button>
                                <button onClick={handleReset} className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors border ${isDarkMode ? 'text-gray-300 hover:text-white border-gray-600' : 'text-gray-600 hover:text-gray-800 border-gray-300'
                                    }`}>
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                                <button onClick={runCode} disabled={isRunDisabled} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-medium transition-colors text-white">
                                    {isRunning ? <Clock size={16} className="animate-spin" /> : <Play size={16} />}
                                    {isRunning ? 'Running...' : 'Run'}
                                </button>
                            </div>
                        </div>

                        {/* Editor */}
                        <SimpleCodeEditor
                            language={language}
                            value={code}
                            onChange={handleCodeChange}
                            theme={isDarkMode ? 'dark' : 'light'}
                            height="320px"
                        />

                        {/* Input Section */}
                        <div className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className="block text-sm font-medium mb-2">
                                Custom Input:
                                {language !== 'python' && <span className="text-red-500"> *</span>}
                            </label>
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className={`w-full px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                placeholder={language === 'python' ? "Enter input for Python input() function..." : "Enter input for your code (required)..."}
                            />
                        </div>

                    </div>

                    {/* Console */}
                    <div className="flex-1">
                        <div className={`border rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'border-white-700' : 'border-gray-300'}`}>
                            <div className={`p-3 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <h4 className="text-sm font-medium">Console</h4>
                                {/* Action Buttons */}
                                <div className={`p-2 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex gap-3 flex-wrap">
                                        <button onClick={handleRunTests} disabled={isRunning} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-medium transition-colors text-white">
                                            {isRunning ? <Clock size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                            Run Tests
                                        </button>
                                    </div>
                                </div>
                                {testResults.length > 0 && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm">{passedTests}/{totalTests} tests passed</span>
                                        <div className={`w-3 h-3 rounded-full ${passedTests === totalTests ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <button onClick={() => setShowTests(!showTests)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}>
                                            {showTests ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            {showTests ? 'Hide' : 'Show'} Tests
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={`p-4 font-mono text-sm h-80 overflow-y-auto ${isDarkMode ? 'bg-black text-green-400' : 'bg-gray-50 text-gray-800'}`}>
                                {isRunning && <div className={`mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>Running code...</div>}

                                {output && (
                                    <div className="mb-2">
                                        <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>Output:</span>
                                        <div className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{output}</div>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-2">
                                        <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>Error:</span>
                                        <div className={`mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</div>
                                    </div>
                                )}

                                {/* Test Results */}
                                {showTests && testResults.length > 0 && (
                                    <div className="mt-4">
                                        <div className={`mb-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                            Test Results ({passedTests}/{totalTests} passed):
                                        </div>
                                        {testResults.slice(0, 2).map((result) => (
                                            <div key={result.id} className="mb-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {result.passed ? (
                                                        <CheckCircle size={14} className="text-green-500" />
                                                    ) : (
                                                        <XCircle size={14} className="text-red-500" />
                                                    )}
                                                    <span className={`text-sm font-medium ${result.passed
                                                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                        : isDarkMode ? 'text-red-400' : 'text-red-600'
                                                        }`}>
                                                        {result.name}
                                                    </span>
                                                </div>
                                                <div className={`text-xs ml-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <div>Input: {result.input}</div>
                                                    <div>Expected: {result.expectedOutput}</div>
                                                    <div>Got: {result.actualOutput}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {testResults.length > 2 && (
                                            <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                ... and {testResults.length - 2} more test case(s)
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!output && !error && !isRunning && testResults.length === 0 && (
                                    <div className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Run your code or tests to see output here...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="border-t pt-6 pb-6 px-6 bg-white border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Ready to submit?
                        </span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-sm font-medium transition-colors text-white shadow-lg"
                    >
                        {isSubmitting ? <Clock size={18} className="animate-spin" /> : <Send size={18} />}
                        {isSubmitting ? 'Submitting Test...' : 'Submit Test'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;