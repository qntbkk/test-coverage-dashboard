import { useState, useRef } from "react";
import html2canvas from "html2canvas";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("user-story");
  const [copyStatus, setCopyStatus] = useState({});

  // Refs for each section
  const defectRef = useRef(null);
  const coverageRef = useRef(null);
  const platformRef = useRef(null);
  const dailyRef = useRef(null);

  const sampleJSON = {
    coverage: {
      metric: "user-story",
      userStories: [
        {
          id: 1,
          story: "User Story 1",
          description:
            "As a user I want to log a bug so that bugs can be tracked",
          covered: 85,
          coveredCount: 136,
          notCoveredCount: 24,
        },
        {
          id: 2,
          story: "User Story 2",
          description:
            "As a user I want to log a bug so that bugs can be tracked",
          covered: 85,
          coveredCount: 73,
          notCoveredCount: 24,
        },
        {
          id: 3,
          story: "User Story 3",
          description:
            "As a user I want to log a bug so that bugs can be tracked",
          covered: 78,
          coveredCount: 98,
          notCoveredCount: 24,
        },
        {
          id: 4,
          story: "User Story 4",
          description:
            "As a user I want to log a bug so that bugs can be tracked",
          covered: 85,
          coveredCount: 45,
          notCoveredCount: 24,
        },
      ],
      testPlans: [
        {
          name: "Test Plan - Sprint 34",
          covered: 85,
          coveredCount: 136,
          notCoveredCount: 24,
        },
      ],
    },
    defects: {
      total: 11,
      statuses: [
        { status: "OPEN", count: 4, percentage: 36.4, color: "#2196F3" },
        { status: "REOPENED", count: 1, percentage: 9.1, color: "#E91E63" },
        { status: "CLOSED", count: 1, percentage: 9.1, color: "#9E9E9E" },
        { status: "NEW", count: 1, percentage: 9.1, color: "#9C27B0" },
        { status: "FIXED", count: 1, percentage: 9.1, color: "#4CAF50" },
        { status: "MONITOR", count: 1, percentage: 9.1, color: "#FF9800" },
        { status: "REJECTED", count: 1, percentage: 9.1, color: "#F44336" },
        { status: "DEFERRED", count: 1, percentage: 9.1, color: "#607D8B" },
      ],
    },
    platform: [
      {
        platform: "Chrome",
        pass: 111,
        fail: 21,
        blocked: 10,
        total: 142,
      },
      {
        platform: "Firefox",
        pass: 48,
        fail: 12,
        blocked: 7,
        total: 67,
      },
      {
        platform: "Safari",
        pass: 29,
        fail: 0,
        blocked: 5,
        total: 34,
      },
    ],
    daily: [
      { date: "Mon, Dec 16", tests: 45, status: "completed", maxTests: 100 },
      { date: "Tue, Dec 17", tests: 62, status: "completed", maxTests: 100 },
      { date: "Weds, Dec 18", tests: 78, status: "peak", maxTests: 100 },
      { date: "Thurs, Dec 18", tests: 52, status: "completed", maxTests: 100 },
      {
        date: "Fri, Dec 20 (Today)",
        tests: 11,
        status: "in-progress",
        maxTests: 100,
      },
    ],
  };

  const handleGenerate = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.coverage || !parsedData.platform || !parsedData.daily) {
        throw new Error("Invalid JSON structure");
      }
      setData(parsedData);
      setSelectedMetric(parsedData.coverage.metric || "user-story");
      setError("");
    } catch (err) {
      setError(`Error: ${err.message}`);
      setData(null);
    }
  };

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(sampleJSON, null, 2));
    setError("");
  };

  const handleReset = () => {
    setJsonInput("");
    setData(null);
    setError("");
    setCopyStatus({});
  };

  // Copy visual as image to clipboard
  const copyVisualToClipboard = async (elementRef, sectionName) => {
    if (!elementRef.current) return;

    try {
      setCopyStatus({ [sectionName]: "copying" });

      // Convert HTML element to canvas
      const canvas = await html2canvas(elementRef.current, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        try {
          // Copy to clipboard using Clipboard API
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);

          setCopyStatus({ [sectionName]: "success" });
          setTimeout(() => setCopyStatus({}), 2000);
        } catch (err) {
          console.error("Clipboard API failed:", err);
          setCopyStatus({ [sectionName]: "error" });
          setTimeout(() => setCopyStatus({}), 2000);
        }
      }, "image/png");
    } catch (err) {
      console.error("Screenshot failed:", err);
      setCopyStatus({ [sectionName]: "error" });
      setTimeout(() => setCopyStatus({}), 2000);
    }
  };

  const CopyButton = ({ sectionName, elementRef }) => {
    const status = copyStatus[sectionName];

    return (
      <button
        onClick={() => copyVisualToClipboard(elementRef, sectionName)}
        disabled={status === "copying"}
        className={`px-5 py-2 bg-white border-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
          status === "success"
            ? "border-green-500 text-green-600 bg-green-50"
            : status === "error"
            ? "border-red-500 text-red-600 bg-red-50"
            : "border-blue-500 text-blue-600 hover:bg-blue-50"
        }`}
      >
        {status === "copying" ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Copying...
          </>
        ) : status === "success" ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          </>
        ) : status === "error" ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Failed
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy Visual
          </>
        )}
      </button>
    );
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Coverage Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Enter your test data in JSON format to generate beautiful reports
            </p>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  JSON Input
                </label>
                <button
                  onClick={handleLoadSample}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  📝 Load Sample Data
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste your JSON data here or click "Load Sample Data"...'
                className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="text-sm text-red-700 font-semibold">❌ {error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleGenerate}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transform transition-all shadow-md hover:shadow-lg"
              >
                🚀 Generate Reports
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 active:scale-95 transform transition-all"
              >
                🔄 Reset
              </button>
            </div>

            <div className="mt-8 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <h3 className="text-sm font-bold text-blue-900 mb-3">
                📋 Expected JSON Structure:
              </h3>
              <pre className="text-xs text-blue-800 overflow-x-auto bg-white p-4 rounded border border-blue-200">
                {`{
  "coverage": { ... },
  "defects": {
    "total": 11,
    "statuses": [...]
  },
  "platform": [...],
  "daily": [...]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Test Coverage Dashboard
          </h1>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 active:scale-95 transform transition-all shadow-md"
          >
            ← Back to Input
          </button>
        </div>

        {/* Defect Status Overview */}
        {data.defects && (
          <div
            ref={defectRef}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Defect Status Overview
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Total Defects:{" "}
                  <span className="font-bold text-blue-600 text-lg">
                    {data.defects.total}
                  </span>
                </p>
              </div>
              <CopyButton sectionName="defect" elementRef={defectRef} />
            </div>

            <div className="flex w-full h-20 rounded-lg shadow-md overflow-hidden mb-6">
              {data.defects.statuses.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-white font-bold text-xs relative group transition-all hover:opacity-90"
                  style={{
                    width: `${(item.count / data.defects.total) * 100}%`,
                    backgroundColor: item.color,
                    minWidth: "80px",
                  }}
                >
                  <div className="text-[10px] uppercase tracking-wide">
                    {item.status}
                  </div>
                  <div className="text-2xl font-bold">{item.count}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.defects.statuses.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-800">
                      {item.status}:
                    </span>{" "}
                    <span className="text-gray-600">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coverage Report */}
        <div
          ref={coverageRef}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Coverage Report
            </h2>
            <CopyButton sectionName="coverage" elementRef={coverageRef} />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Metric
            </label>
            <select
              className="w-64 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="user-story">Covered by User Story</option>
              <option value="test-plan">Test Plan</option>
            </select>
          </div>

          {selectedMetric === "user-story" ? (
            <>
              {data.coverage.userStories?.map((item) => (
                <div key={item.id} className="mb-8">
                  <div className="mb-3 text-base text-gray-800">
                    <strong className="font-bold">{item.story}</strong> –{" "}
                    {item.description}
                  </div>
                  <div className="flex w-full h-12 rounded-lg shadow-md overflow-hidden">
                    <div
                      className="flex items-center px-4 text-white font-bold text-sm"
                      style={{
                        width: `${item.covered}%`,
                        backgroundColor: "#3cb371",
                      }}
                    >
                      {item.covered}% Covered ({item.coveredCount})
                    </div>
                    <div
                      className="flex items-center px-4 text-white font-bold text-sm"
                      style={{
                        width: `${100 - item.covered}%`,
                        backgroundColor: "#ff8c69",
                      }}
                    >
                      {100 - item.covered}% ({item.notCoveredCount})
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {data.coverage.testPlans?.map((item, idx) => (
                <div key={idx} className="mb-8">
                  <div className="mb-3 text-base text-gray-800">
                    <strong className="font-bold">{item.name}</strong>
                  </div>
                  <div className="flex w-full h-12 rounded-lg shadow-md overflow-hidden">
                    <div
                      className="flex items-center px-4 text-white font-bold text-sm"
                      style={{
                        width: `${item.covered}%`,
                        backgroundColor: "#3cb371",
                      }}
                    >
                      {item.covered}% Covered ({item.coveredCount})
                    </div>
                    <div
                      className="flex items-center px-4 text-white font-bold text-sm"
                      style={{
                        width: `${100 - item.covered}%`,
                        backgroundColor: "#ff8c69",
                      }}
                    >
                      {100 - item.covered}% ({item.notCoveredCount})
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="flex justify-center gap-10 mt-8 pt-6 border-t-2 border-gray-100 text-sm font-semibold">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: "#3cb371" }}
              ></div>
              <span className="text-gray-700">Covered</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: "#ff8c69" }}
              ></div>
              <span className="text-gray-700">Not Covered</span>
            </div>
          </div>
        </div>

        {/* Execution by Platform */}
        <div
          ref={platformRef}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Execution by Platform
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Cross-platform test results breakdown
              </p>
            </div>
            <CopyButton sectionName="platform" elementRef={platformRef} />
          </div>

          {data.platform?.map((item, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between mb-3 text-base font-semibold">
                <strong className="text-gray-800">{item.platform}</strong>
                <span className="text-gray-600">{item.total} Tests</span>
              </div>
              <div className="flex w-full h-12 rounded-lg shadow-md overflow-hidden">
                <div
                  className="flex items-center px-4 text-white font-bold text-sm"
                  style={{
                    width: `${(item.pass / item.total) * 100}%`,
                    backgroundColor: "#3cb371",
                  }}
                >
                  Pass: {item.pass}
                </div>
                {item.fail > 0 && (
                  <div
                    className="flex items-center px-4 text-white font-bold text-sm"
                    style={{
                      width: `${(item.fail / item.total) * 100}%`,
                      backgroundColor: "#ff8c69",
                    }}
                  >
                    Fail: {item.fail}
                  </div>
                )}
                {item.blocked > 0 && (
                  <div
                    className="flex items-center px-4 font-bold text-sm"
                    style={{
                      width: `${(item.blocked / item.total) * 100}%`,
                      backgroundColor:
                        item.blocked >= 7 ? "#c0c0c0" : "#ffb3d9",
                      color: item.blocked >= 7 ? "#333" : "white",
                    }}
                  >
                    {item.blocked}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-10 mt-8 pt-6 border-t-2 border-gray-100 text-sm font-semibold">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: "#3cb371" }}
              ></div>
              <span className="text-gray-700">Pass</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: "#ff8c69" }}
              ></div>
              <span className="text-gray-700">Fail</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: "#ffb3d9" }}
              ></div>
              <span className="text-gray-700">Blocked</span>
            </div>
          </div>
        </div>

        {/* Daily Execution */}
        <div ref={dailyRef} className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Daily Execution
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Test velocity and execution trends
              </p>
            </div>
            <CopyButton sectionName="daily" elementRef={dailyRef} />
          </div>

          {data.daily?.map((item, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between mb-3 text-base font-semibold">
                <strong className="text-gray-800">{item.date}</strong>
                <span className="text-gray-600">
                  {item.tests} Tests Executed
                  {item.status === "in-progress" && " (In Progress)"}
                  {item.status === "peak" && " (Peak)"}
                </span>
              </div>
              <div className="w-full h-12 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full flex items-center px-4 text-white font-bold text-sm transition-all duration-500"
                  style={{
                    width: `${(item.tests / item.maxTests) * 100}%`,
                    backgroundColor:
                      item.status === "in-progress" ? "#4169e1" : "#3cb371",
                  }}
                >
                  {item.tests} Tests
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-10 mt-8 pt-6 border-t-2 border-gray-100 text-sm font-semibold">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: "#3cb371" }}
              ></div>
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: "#4169e1" }}
              ></div>
              <span className="text-gray-700">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
