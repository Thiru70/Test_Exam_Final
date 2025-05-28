import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Video, 
  Mic, 
  MicOff, 
  MessageCircle, 
  Send, 
  Bold, 
  Italic, 
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Clock,
  User,
  FileText,
  Code,
  Terminal,
  Users,
  RefreshCw
} from 'lucide-react';

const InterviewInterface = (onNavigateToThankyou) => {
  // State management
  const [activeTab, setActiveTab] = useState('Interview');
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Interviewer', message: 'Welcome to the interview! Please introduce yourself.', time: '10:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [notes, setNotes] = useState('The candidate has problems connecting...\n\nQuestion 1:\nThe candidate wrote the SQL script correctly but...');
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head>
    <title>My Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
        }
        .formula-input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        .slider {
            width: 100%;
            margin: 15px 0;
        }
        .result {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            border-left: 4px solid #667eea;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        button:hover {
            background: #5a67d8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Interactive Formula Calculator</h2>
        <input class="formula-input" name="formula" id="formula" placeholder="Enter a mathematical expression (e.g., x^2 + 2x + 1)" />
        
        <div>
            <label>Iterations: </label>
            <input name="iterations" id="iterations" type="range" min="10" max="100" value="50" class="slider" />
            <span id="iterValue">50</span>
        </div>
        
        <div>
            <label>Precision: </label>
            <input name="precision" id="precision" type="number" value="2" min="1" max="10" class="formula-input" style="width: 80px;" />
        </div>
        
        <button onclick="calculate()">Calculate</button>
        <button onclick="clearAll()">Clear</button>
        
        <div id="result" class="result" style="display: none;"></div>
    </div>

    <script>
        // Update iteration display
        document.getElementById('iterations').addEventListener('input', function() {
            document.getElementById('iterValue').textContent = this.value;
        });
        
        function calculate() {
            const formula = document.getElementById('formula').value;
            const iterations = document.getElementById('iterations').value;
            const precision = document.getElementById('precision').value;
            const resultDiv = document.getElementById('result');
            
            if (!formula) {
                alert('Please enter a formula!');
                return;
            }
            
            try {
                // Simple calculation example
                let result = 'Formula: ' + formula + '\\n';
                result += 'Iterations: ' + iterations + '\\n';
                result += 'Precision: ' + precision + ' decimal places\\n\\n';
                
                // Simulate some calculation
                const randomResult = (Math.random() * 100).toFixed(precision);
                result += 'Calculated Result: ' + randomResult;
                
                resultDiv.innerHTML = '<h3>Results:</h3><pre>' + result + '</pre>';
                resultDiv.style.display = 'block';
                
            } catch (error) {
                resultDiv.innerHTML = '<h3>Error:</h3><p>' + error.message + '</p>';
                resultDiv.style.display = 'block';
            }
        }
        
        function clearAll() {
            document.getElementById('formula').value = '';
            document.getElementById('iterations').value = 50;
            document.getElementById('precision').value = 2;
            document.getElementById('iterValue').textContent = '50';
            document.getElementById('result').style.display = 'none';
        }
        
        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('.container');
            container.style.transform = 'scale(0.9)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                container.style.transition = 'all 0.5s ease';
                container.style.transform = 'scale(1)';
                container.style.opacity = '1';
            }, 100);
        });
    </script>
</body>
</html>`);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  
  // Refs
  const studentVideoRef = useRef(null);
  const studentStreamRef = useRef(null);
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);

  // Initialize student camera
  useEffect(() => {
    const startStudentVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: isAudioOn 
        });
        if (studentVideoRef.current) {
          studentVideoRef.current.srcObject = stream;
        }
        studentStreamRef.current = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startStudentVideo();

    return () => {
      if (studentStreamRef.current) {
        studentStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Toggle audio
  const toggleAudio = () => {
    if (studentStreamRef.current) {
      const audioTracks = studentStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  // Run code in iframe
  const runCode = () => {
    setIsRunning(true);
    setConsoleOutput(['Running code...']);
    
    try {
      // Create a blob with the HTML content
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Update iframe src
      if (iframeRef.current) {
        iframeRef.current.src = url;
        
        // Listen for iframe load
        iframeRef.current.onload = () => {
          setIsRunning(false);
          setConsoleOutput(['✓ Code executed successfully']);
          
          // Inject console capture script into iframe
          try {
            const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
            const script = iframeDoc.createElement('script');
            script.textContent = `
              (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                
                window.parent.postMessage({
                  type: 'console',
                  method: 'log',
                  args: ['Console ready - Page loaded successfully']
                }, '*');
                
                console.log = function(...args) {
                  originalLog.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'log',
                    args: args
                  }, '*');
                };
                
                console.error = function(...args) {
                  originalError.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    args: args
                  }, '*');
                };
                
                console.warn = function(...args) {
                  originalWarn.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'warn',
                    args: args
                  }, '*');
                };
                
                window.onerror = function(msg, url, line, col, error) {
                  window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    args: ['Error: ' + msg + ' at line ' + line]
                  }, '*');
                };
              })();
            `;
            iframeDoc.head.appendChild(script);
          } catch (e) {
            console.log('Could not inject console script:', e);
          }
          
          // Clean up blob URL
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        };
        
        iframeRef.current.onerror = () => {
          setIsRunning(false);
          setConsoleOutput(['✗ Error loading code']);
        };
      }
    } catch (error) {
      setIsRunning(false);
      setConsoleOutput(['✗ Error: ' + error.message]);
    }
  };

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console') {
        const { method, args } = event.data;
        const timestamp = new Date().toLocaleTimeString();
        const message = args.join(' ');
        
        setConsoleOutput(prev => [...prev.slice(-10), `[${timestamp}] ${message}`]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Clear console
  const clearConsole = () => {
    setConsoleOutput([]);
  };

  // Format text in notes
  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="text-blue-500" size={20} />
            <span className="font-medium">Interview</span>
          </div>
          
          <div className="flex space-x-1">
            {['Interview', 'Sorted Search', 'Enrollment'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === tab 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-600 hover:bg-gray-300">
              +
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>3 min 6 sec</span>
          </div>
          <button onClick={handleEndInterview} className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600">
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Notes & Chat */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Notes Section */}
          <div className="flex-1 border-b">
            <div className="p-3 border-b bg-gray-50">
              <div className="flex items-center space-x-2 mb-2">
                <FileText size={16} className="text-gray-600" />
                <span className="font-medium text-sm">Questions</span>
                <span className="text-xs text-gray-500">Private Notes</span>
              </div>
              
              {/* Formatting Toolbar */}
              <div className="flex space-x-1">
                <button 
                  onClick={() => formatText('bold')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Bold size={14} />
                </button>
                <button 
                  onClick={() => formatText('italic')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Italic size={14} />
                </button>
                <button 
                  onClick={() => formatText('underline')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Underline size={14} />
                </button>
                <button 
                  onClick={() => formatText('insertUnorderedList')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <List size={14} />
                </button>
                <button 
                  onClick={() => formatText('justifyLeft')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <AlignLeft size={14} />
                </button>
                <button 
                  onClick={() => formatText('justifyCenter')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <AlignCenter size={14} />
                </button>
                <button 
                  onClick={() => formatText('justifyRight')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <AlignRight size={14} />
                </button>
              </div>
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-48 p-3 resize-none focus:outline-none text-sm"
              placeholder="Write your interview notes here..."
            />
          </div>

          {/* Video Section */}
          <div className="h-48 bg-black relative">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616c4308ff4?w=400&h=300&fit=crop&crop=face"
              alt="Interviewer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              Sunshine Caprio - Interviewer
            </div>
            
            {/* Student video (small overlay) */}
            <div className="absolute bottom-2 right-2 w-16 h-12 bg-gray-800 rounded overflow-hidden border-2 border-white">
              <video
                ref={studentVideoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Video controls */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button className="w-8 h-8 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70">
                <Video size={14} />
              </button>
              <button 
                onClick={toggleAudio}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 ${
                  isAudioOn ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {isAudioOn ? <Mic size={14} /> : <MicOff size={14} />}
              </button>
              <button className="w-8 h-8 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70">
                <MessageCircle size={14} />
              </button>
            </div>
          </div>

          {/* Chat Section */}
          <div className="h-48 flex flex-col">
            <div className="p-2 bg-gray-50 border-b">
              <span className="text-sm font-medium">Chat with Sunshine Caprio</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs">
                  <div className="flex items-center space-x-1 mb-1">
                    <User size={12} className="text-gray-500" />
                    <span className="font-medium text-gray-700">{msg.sender}</span>
                    <span className="text-gray-500">{msg.time}</span>
                  </div>
                  <div className="bg-gray-100 rounded p-2 text-gray-800">
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-2 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor & Output */}
        <div className="flex-1 flex flex-col">
          {/* Code Editor Header */}
          <div className="bg-gray-50 border-b p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code size={16} className="text-gray-600" />
              <span className="text-sm font-medium">HTML CSS JS</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-blue-400"
            >
              <Play size={14} />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          </div>

          {/* Code Editor and Output Split */}
          <div className="flex-1 flex">
            {/* Code Editor */}
          
           {/* Code Editor */}
            <div className="w-1/2 flex flex-col border-r">
              <div className="flex-1 relative overflow-hidden">
                {/* Line numbers */}
                <div className="absolute left-0 top-0 w-8 h-full bg-gray-800 text-gray-400 text-xs py-4 font-mono z-10 overflow-hidden">
                  <div className="leading-5">
                    {code.split('\n').map((_, index) => (
                      <div key={index} className="px-1">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
                
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full pl-10 p-4 font-mono text-sm bg-gray-900 text-white resize-none focus:outline-none overflow-auto"
                  style={{ lineHeight: '1.25rem' }}
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="w-1/2 flex flex-col">
              {/* Output Header */}
              <div className="bg-gray-100 border-b p-2 flex items-center justify-between">
                <span className="text-sm font-medium">Live Preview</span>
                <button
                  onClick={runCode}
                  className="text-blue-500 hover:text-blue-700"
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              
              {/* Live Preview */}
              <div className="flex-1 bg-white">
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-none"
                  title="Code Output"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>

          {/* Console */}
          <div className="h-32 border-t">
            <div className="bg-gray-800 text-white p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal size={16} />
                <span className="text-sm">Console</span>
              </div>
              <button
                onClick={clearConsole}
                className="text-xs text-gray-300 hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="bg-black text-green-400 p-3 font-mono text-sm h-24 overflow-y-auto">
              {consoleOutput.map((line, index) => (
                <div key={index} className="mb-1">{line}</div>
              ))}
              {isRunning && (
                <div className="text-yellow-400">Processing...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewInterface;