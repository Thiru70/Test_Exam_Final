import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';

// Simple Code Editor Component (same as before)
const SimpleCodeEditor = ({ language, value, onChange, theme = 'dark', height = '320px' }) => {
    const textareaRef = useRef(null);

    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            onChange(newValue);

            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 2;
            }, 0);
        }
    };

    const isDark = theme === 'dark';

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ height }}
            className={`w-full p-4 font-mono text-sm resize-none border-0 focus:outline-none ${
                isDark
                    ? 'bg-gray-900 text-gray-100'
                    : 'bg-white text-gray-900'
            }`}
            placeholder={`Write your code here...`}
            spellCheck={false}
        />
    );
};

// Pyodide Manager (same as before)
class PyodideManager {
    constructor() {
        this.pyodide = null;
        this.isLoading = false;
        this.isLoaded = false;
        this.loadPromise = null;
    }

    async loadPyodide() {
        if (this.isLoaded) return this.pyodide;
        if (this.loadPromise) return this.loadPromise;

        this.loadPromise = this._loadPyodideInternal();
        return this.loadPromise;
    }

    async _loadPyodideInternal() {
        if (this.isLoading) return;

        this.isLoading = true;

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
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
                stdout: (text) => console.log(text),
                stderr: (text) => console.error(text),
            });

            this.isLoaded = true;
            this.isLoading = false;

            return this.pyodide;
        } catch (error) {
            this.isLoading = false;
            console.error('Failed to load Pyodide:', error);
            throw error;
        }
    }

    async runPython(code, input = '') {
        if (!this.isLoaded) {
            await this.loadPyodide();
        }

        const output = [];
        const errors = [];

        this.pyodide.setStdout({
            batched: (text) => output.push(text),
            isatty: false
        });

        this.pyodide.setStderr({
            batched: (text) => errors.push(text),
            isatty: false
        });

        try {
            let modifiedCode = code;

            if (input.trim()) {
                const inputLines = input.split('\n').filter(line => line.trim());

                modifiedCode = `
import sys
from io import StringIO

_input_values = [${inputLines.map(line => `'${line.replace(/'/g, "\\'")}'`).join(', ')}]
_input_index = 0

def input(prompt=''):
    global _input_index
    if _input_index < len(_input_values):
        value = _input_values[_input_index]
        _input_index += 1
        if prompt:
            print(prompt, end='')
        return value
    return ''

${modifiedCode}
`;
            }

            await this.pyodide.runPythonAsync(modifiedCode);

            return {
                output: output.join('').trim(),
                error: errors.join('').trim(),
                success: true
            };
        } catch (error) {
            return {
                output: output.join('').trim(),
                error: error.message || errors.join('').trim(),
                success: false
            };
        }
    }

    getStatus() {
        if (this.isLoaded) return 'loaded';
        if (this.isLoading) return 'loading';
        return 'not-loaded';
    }
}

// Global Pyodide instance
const pyodideManager = new PyodideManager();

// Updated CodeEditor component to accept props from CodingSection
const CodeEditor = ({ 
    question, 
    codeTemplate, 
    testCases = [], 
    testData, 
    currentQuestionIndex 
}) => {
    const [language, setLanguage] = useState('python'); // Default to Python based on your API data
    const [code, setCode] = useState('');
    const [customInput, setCustomInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [showTests, setShowTests] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [pyodideStatus, setPyodideStatus] = useState('not-loaded');

    // Initialize code with the template when question changes
    useEffect(() => {
        if (codeTemplate) {
            setCode(codeTemplate);
        }
        // Reset other states when question changes
        setOutput('');
        setError('');
        setTestResults([]);
        setShowTests(false);
        setCustomInput('');
    }, [codeTemplate, currentQuestionIndex]);

    // Load Pyodide for Python execution
    useEffect(() => {
        if (language === 'python') {
            setPyodideStatus('loading');
            pyodideManager.loadPyodide()
                .then(() => setPyodideStatus('loaded'))
                .catch(() => setPyodideStatus('error'));
        }
    }, [language]);

    const executeCode = async (inputValue = customInput, isTestCase = false) => {
        try {
            let result = '';

            if (language === 'python') {
                if (pyodideStatus !== 'loaded') {
                    throw new Error('Python environment is still loading. Please wait...');
                }

                // For test cases, we need to handle the function calls differently
                let executableCode = code;
                
                if (isTestCase && inputValue) {
                    // Extract function name from the code template
                    const functionMatch = code.match(/def\s+(\w+)\s*\(/);
                    const functionName = functionMatch ? functionMatch[1] : 'solution';
                    
                    // Handle different input formats based on the question
                    let processedInput = inputValue;
                    
                    // For anagram questions with space-separated inputs
                    if (question?.question?.toLowerCase().includes('anagram') && inputValue.includes(' ')) {
                        const parts = inputValue.split(' ');
                        if (parts.length === 2) {
                            processedInput = `"${parts[0]}", "${parts[1]}"`;
                        }
                    } else if (inputValue.includes(' ')) {
                        // For other space-separated inputs, treat as string
                        processedInput = `"${inputValue}"`;
                    } else {
                        // For numeric inputs or single strings
                        if (!isNaN(inputValue)) {
                            processedInput = inputValue;
                        } else {
                            processedInput = `"${inputValue}"`;
                        }
                    }
                    
                    executableCode = `
${code}

# Test execution
try:
    result = ${functionName}(${processedInput})
    print(result)
except Exception as e:
    print(f"Error: {e}")
`;
                }

                const pythonResult = await pyodideManager.runPython(executableCode, inputValue);

                if (pythonResult.success) {
                    result = pythonResult.output || 'No output';
                } else {
                    throw new Error(pythonResult.error);
                }
            }

            return result.trim();
        } catch (error) {
            throw error;
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('');
        setError('');

        try {
            const result = await executeCode();
            setOutput(result || 'No output');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    const handleRunTests = async () => {
        if (!testCases || testCases.length === 0) {
            setError('No test cases available for this question');
            return;
        }

        setIsRunning(true);
        setShowTests(true);
        setOutput('');
        setError('');

        const results = [];

        for (const testCase of testCases) {
            try {
                const result = await executeCode(testCase.input, true);
                const cleanResult = result.trim();

                const passed = cleanResult === testCase.expectedOutput;
                results.push({
                    ...testCase,
                    actualOutput: cleanResult,
                    passed
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

    const handleReset = () => {
        setCode(codeTemplate || '');
        setOutput('');
        setError('');
        setCustomInput('');
        setTestResults([]);
        setShowTests(false);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleTestResults = () => {
        setShowTests(!showTests);
    };

    const getEditorTheme = () => {
        return isDarkMode ? 'dark' : 'light';
    };

    const passedTests = testResults.filter(test => test.passed).length;
    const totalTests = testResults.length;

    const isRunDisabled = isRunning || (language === 'python' && pyodideStatus !== 'loaded');
    const isTestDisabled = isRunning || (language === 'python' && pyodideStatus !== 'loaded');

     return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Code Editor */}
            <div className="flex-1">
                <div className={`border rounded-lg overflow-hidden shadow-sm ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-300'
                }`}>
                    <div className={`p-3 flex justify-between items-center ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Python</span>
                            {language === 'python' && pyodideStatus === 'loading' && (
                                <span className="text-xs text-yellow-500">Loading Python...</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleTheme}
                                className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${
                                    isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                                        : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                                }`}
                            >
                                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <button
                                onClick={handleReset}
                                className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${
                                    isDarkMode
                                        ? 'text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500'
                                        : 'text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <RotateCcw size={16} />
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Code Editor Area */}
                    <SimpleCodeEditor
                        language={language}
                        value={code}
                        onChange={setCode}
                        theme={getEditorTheme()}
                        height="400px"
                    />

                    {/* Control Buttons */}
                    <div className={`p-3 flex gap-2 ${
                        isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'
                    }`}>
                        <button
                            onClick={runCode}
                            disabled={isRunDisabled}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                            {isRunning ? <Clock size={16} className="animate-spin" /> : <Play size={16} />}
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>

                        <button
                            onClick={handleRunTests}
                            disabled={isTestDisabled || !testCases.length}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                            Run Tests ({testCases.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Output and Test Results Panel */}
            <div className="flex-1">
                <div className={`border rounded-lg overflow-hidden shadow-sm ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-300'
                }`}>
                    {/* Custom Input Section */}
                    <div className={`p-3 border-b ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                    }`}>
                        <label className="block text-sm font-medium mb-2">Custom Input (optional):</label>
                        <textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Enter input for your code..."
                            className={`w-full p-2 text-sm border rounded resize-none ${
                                isDarkMode
                                    ? 'bg-gray-900 text-gray-100 border-gray-600'
                                    : 'bg-white text-gray-900 border-gray-300'
                            }`}
                            rows={3}
                        />
                    </div>

                    {/* Output Section */}
                    <div className={`p-3 ${
                        isDarkMode ? 'bg-gray-900' : 'bg-white'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Output:</span>
                        </div>
                        <div className={`p-3 rounded text-sm font-mono min-h-[100px] max-h-[200px] overflow-y-auto ${
                            isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-900'
                        }`}>
                            {error ? (
                                <div className="text-red-500">{error}</div>
                            ) : (
                                <div className="whitespace-pre-wrap">{output || 'No output yet'}</div>
                            )}
                        </div>
                    </div>

                    {/* Test Results Section */}
                    {testResults.length > 0 && (
                        <div className={`border-t ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className={`p-3 cursor-pointer ${
                                isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-100 hover:bg-gray-200'
                            }`} onClick={toggleTestResults}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Test Results ({passedTests}/{totalTests} passed)
                                    </span>
                                    {showTests ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </div>

                            {showTests && (
                                <div className={`p-3 max-h-[300px] overflow-y-auto ${
                                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                                }`}>
                                    {testResults.map((result, index) => (
                                        <div key={index} className={`mb-3 p-3 rounded border ${
                                            result.passed
                                                ? isDarkMode ? 'border-green-600 bg-green-900/20' : 'border-green-300 bg-green-50'
                                                : isDarkMode ? 'border-red-600 bg-red-900/20' : 'border-red-300 bg-red-50'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {result.passed ? 
                                                    <CheckCircle size={16} className="text-green-500" /> : 
                                                    <XCircle size={16} className="text-red-500" />
                                                }
                                                <span className="text-sm font-medium">
                                                    Test Case {index + 1} {result.passed ? 'Passed' : 'Failed'}
                                                </span>
                                            </div>
                                            <div className="text-xs space-y-1">
                                                <div><strong>Input:</strong> {result.input}</div>
                                                <div><strong>Expected:</strong> {result.expectedOutput}</div>
                                                <div><strong>Actual:</strong> {result.actualOutput}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimpleCodeEditor;
