import { useState } from "react";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("user-story");

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
  "coverage": {
    "metric": "user-story" or "test-plan",
    "userStories": [...],
    "testPlans": [...]
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

        {/* Coverage Report */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Coverage Report
            </h2>
            <button className="px-5 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 flex items-center gap-2 transition-all">
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
            </button>
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
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Execution by Platform
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Cross-platform test results breakdown
              </p>
            </div>
            <button className="px-5 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 flex items-center gap-2 transition-all">
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
            </button>
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
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Daily Execution
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Test velocity and execution trends
              </p>
            </div>
            <button className="px-5 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 flex items-center gap-2 transition-all">
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
            </button>
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
