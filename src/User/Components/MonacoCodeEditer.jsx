import React, { useState, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

const MonacoEditor = () => {
  const editorRef = useRef(null);
  const monaco = useMonaco();
  
  // Language templates
  const languageTemplates = {
    javascript: `// Welcome to JavaScript
function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('World');

// Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled numbers:', doubled);

// Object example
const person = {
  name: 'John',
  age: 30,
  city: 'New York'
};
console.log('Person:', person);`,

    typescript: `// Welcome to TypeScript
interface Person {
  name: string;
  age: number;
  city: string;
}

function greet(name: string): void {
  console.log('Hello, ' + name + '!');
}

greet('World');

// Type-safe array operations
const numbers: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = numbers.map((n: number) => n * 2);
console.log('Doubled numbers:', doubled);

// Object with interface
const person: Person = {
  name: 'John',
  age: 30,
  city: 'New York'
};
console.log('Person:', person);`,

    python: `# Welcome to Python
def greet(name):
    print(f'Hello, {name}!')

greet('World')

# List operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print('Doubled numbers:', doubled)

# Dictionary example
person = {
    'name': 'John',
    'age': 30,
    'city': 'New York'
}
print('Person:', person)

# Class example
class Calculator:
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        return a * b

calc = Calculator()
result = calc.add(5, 3)
print('5 + 3 =', result)`,

    java: `// Welcome to Java
public class HelloWorld {
    public static void main(String[] args) {
        greet("World");
        
        // Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        int[] doubled = new int[numbers.length];
        
        for (int i = 0; i < numbers.length; i++) {
            doubled[i] = numbers[i] * 2;
        }
        
        System.out.print("Doubled numbers: ");
        for (int num : doubled) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Object example
        Person person = new Person("John", 30, "New York");
        System.out.println("Person: " + person.toString());
    }
    
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}

class Person {
    private String name;
    private int age;
    private String city;
    
    public Person(String name, int age, String city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }
    
    public String toString() {
        return name + ", " + age + ", " + city;
    }
}`,

    csharp: `// Welcome to C#
using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        Greet("World");
        
        // Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        int[] doubled = numbers.Select(n => n * 2).ToArray();
        
        Console.WriteLine("Doubled numbers: " + string.Join(", ", doubled));
        
        // Object example
        var person = new Person("John", 30, "New York");
        Console.WriteLine($"Person: {person}");
    }
    
    public static void Greet(string name)
    {
        Console.WriteLine($"Hello, {name}!");
    }
}

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string City { get; set; }
    
    public Person(string name, int age, string city)
    {
        Name = name;
        Age = age;
        City = city;
    }
    
    public override string ToString()
    {
        return $"{Name}, {Age}, {City}";
    }
}`,

    cpp: `// Welcome to C++
#include <iostream>
#include <vector>
#include <string>

void greet(const std::string& name) {
    std::cout << "Hello, " << name << "!" << std::endl;
}

class Person {
private:
    std::string name;
    int age;
    std::string city;

public:
    Person(const std::string& n, int a, const std::string& c) 
        : name(n), age(a), city(c) {}
    
    void display() const {
        std::cout << "Person: " << name << ", " << age << ", " << city << std::endl;
    }
};

int main() {
    greet("World");
    
    // Vector operations
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::vector<int> doubled;
    
    for (int num : numbers) {
        doubled.push_back(num * 2);
    }
    
    std::cout << "Doubled numbers: ";
    for (int num : doubled) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Object example
    Person person("John", 30, "New York");
    person.display();
    
    return 0;
}`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .highlight { color: #007acc; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to HTML</h1>
        <p>This is a <span class="highlight">sample HTML document</span> with embedded CSS and JavaScript.</p>
        
        <h2>Interactive Elements</h2>
        <button onclick="greet()">Click me!</button>
        <input type="text" id="nameInput" placeholder="Enter your name">
        
        <div id="output" style="margin-top: 20px; padding: 10px; background: #e8f4fd; border-radius: 5px;"></div>
    </div>

    <script>
        function greet() {
            const name = document.getElementById('nameInput').value || 'World';
            const output = document.getElementById('output');
            output.innerHTML = '<strong>Hello, ' + name + '!</strong>';
        }
    </script>
</body>
</html>`,

    css: `/* Welcome to CSS */
/* Modern CSS with Flexbox and Grid */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.card {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    text-align: center;
}

.btn {
    display: inline-block;
    padding: 12px 24px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 25px;
    transition: background 0.3s ease;
}

.btn:hover {
    background: #2980b9;
}

/* Responsive design */
@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
        padding: 10px;
    }
}`,

    json: `{
  "name": "Welcome to JSON",
  "description": "A sample JSON document with various data types",
  "version": "1.0.0",
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "location": {
      "city": "New York",
      "country": "USA",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    }
  },
  "languages": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++"
  ],
  "features": {
    "syntax_highlighting": true,
    "auto_completion": true,
    "error_detection": true,
    "multi_language_support": true
  },
  "numbers": [1, 2, 3, 4, 5],
  "boolean_values": {
    "is_active": true,
    "is_deprecated": false
  },
  "null_value": null,
  "nested_array": [
    {
      "id": 1,
      "name": "Item 1",
      "tags": ["tag1", "tag2"]
    },
    {
      "id": 2,
      "name": "Item 2",
      "tags": ["tag3", "tag4"]
    }
  ]
}`,

    sql: `-- Welcome to SQL
-- Sample database operations

-- Create tables
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE
);

CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    manager_id INT,
    budget DECIMAL(12, 2)
);

-- Insert sample data
INSERT INTO employees (id, name, department, salary, hire_date) VALUES
(1, 'John Doe', 'Engineering', 75000.00, '2022-01-15'),
(2, 'Jane Smith', 'Marketing', 65000.00, '2022-03-20'),
(3, 'Mike Johnson', 'Engineering', 80000.00, '2021-11-10'),
(4, 'Sarah Wilson', 'HR', 60000.00, '2023-02-01');

INSERT INTO departments (id, name, manager_id, budget) VALUES
(1, 'Engineering', 3, 500000.00),
(2, 'Marketing', 2, 200000.00),
(3, 'HR', 4, 150000.00);

-- Sample queries
SELECT * FROM employees;

SELECT name, salary 
FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary DESC;

SELECT department, AVG(salary) as avg_salary, COUNT(*) as employee_count
FROM employees 
GROUP BY department;

-- Join example
SELECT e.name, e.salary, d.name as department_name, d.budget
FROM employees e
JOIN departments d ON e.department = d.name;`,

    markdown: `# Welcome to Markdown

This is a **comprehensive Markdown example** showcasing various features.

## Table of Contents
- [Headers](#headers)
- [Text Formatting](#text-formatting)
- [Lists](#lists)
- [Links and Images](#links-and-images)
- [Code](#code)
- [Tables](#tables)

## Headers

# H1 Header
## H2 Header  
### H3 Header
#### H4 Header

## Text Formatting

**Bold text** and *italic text* and ***bold italic***

~~Strikethrough text~~

> This is a blockquote
> 
> It can span multiple lines

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered List
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

### Task List
- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Links and Images

[Visit GitHub](https://github.com)

![Alt text](https://via.placeholder.com/300x200 "Image title")

## Code

Inline \`code\` example.

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log('Hello, ' + name + '!');
}
greet('World');
\`\`\`

\`\`\`python
def greet(name):
    print(f'Hello, {name}!')
greet('World')
\`\`\`

## Tables

| Language   | Year Created | Paradigm    |
|------------|--------------|-------------|
| JavaScript | 1995         | Multi       |
| Python     | 1991         | Multi       |
| Java       | 1995         | OOP         |
| C++        | 1985         | Multi       |

## Other Elements

---

Math: E = mc²

Horizontal rule above this line.

### Footnotes

Here's a sentence with a footnote¹.

¹ This is the footnote.`
  };

  const [code, setCode] = useState(languageTemplates.javascript);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [output, setOutput] = useState([]);
  const [showConsole, setShowConsole] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage] || '// Welcome to ' + newLanguage);
    setOutput([]); // Clear output when changing language
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const addToOutput = (message, type = 'log') => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { message, type, timestamp }]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const handleRunCode = () => {
    if (language === 'javascript') {
      try {
        // Clear previous output
        setOutput([]);
        setShowConsole(true);
        
        // Override console methods to capture output
        const originalConsole = window.console;
        const capturedOutput = [];
        
        window.console = {
          ...originalConsole,
          log: (...args) => {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            capturedOutput.push({ message, type: 'log' });
            originalConsole.log(...args);
          },
          error: (...args) => {
            const message = args.map(arg => String(arg)).join(' ');
            capturedOutput.push({ message, type: 'error' });
            originalConsole.error(...args);
          },
          warn: (...args) => {
            const message = args.map(arg => String(arg)).join(' ');
            capturedOutput.push({ message, type: 'warn' });
            originalConsole.warn(...args);
          }
        };
        
        // Execute the code
        new Function(code)();
        
        // Restore original console
        window.console = originalConsole;
        
        // Update output state
        const timestamp = new Date().toLocaleTimeString();
        const outputWithTimestamp = capturedOutput.map(item => ({
          ...item,
          timestamp
        }));
        
        setOutput(outputWithTimestamp);
        
        if (outputWithTimestamp.length === 0) {
          addToOutput('Code executed successfully (no output)', 'success');
        }
        
      } catch (error) {
        addToOutput(`Error: ${error.message}`, 'error');
        setShowConsole(true);
      }
    } else {
      addToOutput(`Code execution is only available for JavaScript. Current language: ${language}`, 'warn');
      setShowConsole(true);
    }
  };

  const showValue = () => {
    if (editorRef.current) {
      const value = editorRef.current.getValue();
      addToOutput(`Editor content:\n${value}`, 'info');
      setShowConsole(true);
    }
  };

  const insertText = (text) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      const range = new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      );
      const id = { major: 1, minor: 1 };
      const op = { identifier: id, range: range, text: text, forceMoveMarkers: true };
      editorRef.current.executeEdits('my-source', [op]);
    }
  };

  const getOutputIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold">Enhanced Monaco Editor</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm">Language:</label>
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="sql">SQL</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm">Theme:</label>
            <select 
              value={theme} 
              onChange={handleThemeChange}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vs-dark">Dark</option>
              <option value="vs">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-2 bg-gray-700 border-b border-gray-600">
        <button
          onClick={handleFormatCode}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
        >
          Format Code
        </button>
        <button
          onClick={handleRunCode}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
        >
          Run Code {language !== 'javascript' && '(JS only)'}
        </button>
        <button
          onClick={() => setShowConsole(!showConsole)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            showConsole 
              ? 'bg-yellow-600 hover:bg-yellow-700' 
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          {showConsole ? 'Hide Console' : 'Show Console'}
        </button>
        <button
          onClick={clearOutput}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
        >
          Clear Console
        </button>
        <button
          onClick={showValue}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors"
        >
          Show Value
        </button>
        <button
          onClick={() => insertText('// TODO: ')}
          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-sm font-medium transition-colors"
        >
          Insert TODO
        </button>
        <div className="text-sm text-gray-300 ml-auto">
          Lines: {code.split('\n').length} | Characters: {code.length}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className={`${showConsole ? 'w-3/5' : 'w-full'} transition-all duration-300`}>
          <Editor
            height="100%"
            language={language}
            theme={theme}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              minimap: { enabled: true },
              folding: true,
              wordWrap: 'on',
              cursorStyle: 'line',
              renderWhitespace: 'selection',
              tabSize: 2,
              insertSpaces: true,
              automaticLayout: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              quickSuggestions: true,
              contextmenu: true,
              mouseWheelZoom: true,
            }}
          />
        </div>

        {/* Console */}
        {showConsole && (
          <div className="w-2/5 bg-gray-900 border-l border-gray-600 flex flex-col">
            <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-600">
              <h3 className="text-sm font-semibold">Console Output</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {output.length} {output.length === 1 ? 'entry' : 'entries'}
                </span>
                <button
                  onClick={clearOutput}
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {output.length === 0 ? (
                <div className="text-gray-500 text-sm italic">
                  No output yet. Run some JavaScript code to see results here.
                </div>
              ) : (
                output.map((item, index) => (
                  <div key={index} className={`text-sm ${getOutputColor(item.type)}`}>
                    <div className="flex items-start space-x-2">
                      <span className="text-xs opacity-75">
                        {getOutputIcon(item.type)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-60">{item.timestamp}</span>
                          <span className="text-xs opacity-60 uppercase">{item.type}</span>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-sm mt-1">
                          {item.message}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-gray-700 text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-green-400">● Ready</span>
          <span>Language: {language}</span>
          <span>Theme: {theme}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          {showConsole && <span>Console: {output.length} entries</span>}
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;