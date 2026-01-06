import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import ReactECharts from "echarts-for-react";

function App() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [jsonInput, setJsonInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const chartRef = useRef(null);

  // Define available charts for each report type
  const reportCharts = {
    coverage: [
      { id: "executive-summary", name: "Executive Summary", icon: "📊" },
      { id: "coverage-report", name: "Coverage Report", icon: "📈" },
      { id: "coverage-overview", name: "Coverage Overview", icon: "📋" },
      {
        id: "coverage-table",
        name: "Coverage by User Story (Table)",
        icon: "📑",
      },
    ],
    lab: [
      { id: "lab-executive", name: "Executive Summary", icon: "📊" },
      {
        id: "execution-status",
        name: "Overall Execution Status (Pie Chart)",
        icon: "🥧",
      },
      {
        id: "suite-distribution",
        name: "Suite Status Distribution",
        icon: "📊",
      },
      { id: "platform-execution", name: "Execution by Platform", icon: "💻" },
      {
        id: "daily-execution",
        name: "Daily Execution (Bar Chart)",
        icon: "📅",
      },
    ],
    defect: [
      { id: "defect-executive", name: "Executive Summary", icon: "📊" },
      { id: "defect-status", name: "Defect Status Overview", icon: "🐛" },
      { id: "defect-severity", name: "Defect by Severity", icon: "⚠️" },
    ],
  };

  // Sample JSON for each chart type WITH COLORS
  const sampleJSONs = {
    "executive-summary": {
      totalRequirements: 156,
      covered: 124,
      notCovered: 32,
      coverageRate: 79.5,
      totalTestCases: 238,
    },
    "coverage-report": {
      metric: "user-story",
      colors: {
        covered: "#10b981",
        notCovered: "#fb923c",
      },
      userStories: [
        {
          id: 1,
          userStory: "User Story 1",
          description:
            "As a user I want to log a bug so that bugs can be tracked",
          covered: 85,
          coveredCount: 136,
          notCoveredCount: 24,
        },
        {
          id: 2,
          userStory: "User Story 2",
          description:
            "As a user I want to view defects so that I can track issues",
          covered: 92,
          coveredCount: 73,
          notCoveredCount: 6,
        },
      ],
      testPlan: {
        name: "Test Plan - Sprint 34",
        covered: 85,
        coveredCount: 136,
        notCoveredCount: 24,
      },
    },
    "coverage-overview": {
      totalUserStories: 75,
      fullCoverage: 45,
      partialCoverage: 18,
      noCoverage: 12,
      colors: {
        totalUserStories: "#06b6d4",
        fullCoverage: "#14b8a6",
        partialCoverage: "#fbbf24",
        noCoverage: "#f87171",
      },
    },
    "coverage-table": {
      stories: [
        {
          userStoryId: 10,
          userStory: "EndUserAuthenticationAndAuthorize",
          priority: "High",
          testRequirements: 5,
          covered: 0,
          notCovered: 5,
          status: "Not Started",
        },
        {
          userStoryId: 20,
          userStory: "EndUserRedirectAfterAuthorize",
          priority: "High",
          testRequirements: 5,
          covered: 3,
          notCovered: 2,
          status: "In Progress",
        },
      ],
    },
    "lab-executive": {
      totalTestCases: 252,
      activeSuites: 15,
      passed: 189,
      failed: 38,
      blocked: 12,
      noRun: 13,
    },
    "execution-status": {
      total: 252,
      passed: 189,
      failed: 38,
      blocked: 12,
      noRun: 13,
      colors: {
        passed: "#3cb371",
        failed: "#ff8c69",
        blocked: "#c0c0c0",
        noRun: "#ffd700",
      },
    },
    "suite-distribution": {
      total: 15,
      inProgress: 8,
      completed: 5,
      notStarted: 2,
      colors: {
        inProgress: "#4169e1",
        completed: "#3cb371",
        notStarted: "#c0c0c0",
      },
    },
    "platform-execution": {
      platforms: [
        {
          platform: "Chrome",
          pass: 111,
          fail: 21,
          blocked: 10,
          noRun: 0,
          total: 142,
        },
        {
          platform: "Firefox",
          pass: 48,
          fail: 12,
          blocked: 7,
          noRun: 1,
          total: 68,
        },
        {
          platform: "Safari",
          pass: 29,
          fail: 5,
          blocked: 3,
          noRun: 1,
          total: 38,
        },
      ],
      colors: {
        pass: "#3cb371",
        fail: "#ff8c69",
        blocked: "#c0c0c0",
        noRun: "#ffd700",
      },
    },
    "daily-execution": {
      days: [
        {
          date: "Mon, Dec 16",
          tests: 45,
          day: "completed",
          label: "45 Tests Executed",
        },
        {
          date: "Tue, Dec 17",
          tests: 62,
          day: "completed",
          label: "62 Tests Executed",
        },
        {
          date: "Weds, Dec 18",
          tests: 78,
          day: "completed",
          label: "78 Tests Executed (Peak)",
        },
        {
          date: "Thurs, Dec 19",
          tests: 52,
          day: "completed",
          label: "52 Tests Executed",
        },
        {
          date: "Fri, Dec 20 (Today)",
          tests: 11,
          day: "today",
          label: "11 Tests Executed (In Progress)",
        },
      ],
      colors: {
        completed: "#3cb371",
        today: "#4169e1",
      },
    },
    "defect-executive": {
      total: 85,
      critical: 12,
      high: 28,
      medium: 34,
      low: 11,
    },
    "defect-status": {
      total: 85,
      statuses: [
        { status: "NEW", count: 8, color: "#9C27B0" },
        { status: "OPEN", count: 25, color: "#2196F3" },
        { status: "CLOSED", count: 15, color: "#9E9E9E" },
        { status: "FIXED", count: 18, color: "#4CAF50" },
        { status: "MONITOR", count: 7, color: "#FF9800" },
        { status: "REJECTED", count: 5, color: "#F44336" },
        { status: "REOPENED", count: 4, color: "#E91E63" },
        { status: "DEFERRED", count: 3, color: "#607D8B" },
      ],
    },
    "defect-severity": {
      total: 85,
      critical: 12,
      high: 28,
      medium: 34,
      low: 11,
      colors: {
        critical: "#ef4444",
        high: "#fb923c",
        medium: "#fbbf24",
        low: "#22c55e",
      },
    },
  };

  const handleLoadSample = () => {
    if (selectedChart && sampleJSONs[selectedChart]) {
      setJsonInput(JSON.stringify(sampleJSONs[selectedChart], null, 2));
      setError("");
    }
  };

  const handleGenerate = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setData(parsedData);
      setError("");
    } catch (err) {
      setError(`Error parsing JSON: ${err.message}`);
      setData(null);
    }
  };

  const handleReset = () => {
    setSelectedReport(null);
    setSelectedChart(null);
    setJsonInput("");
    setData(null);
    setError("");
    setCopyStatus("");
  };

  const handleBackToChartSelection = () => {
    setSelectedChart(null);
    setJsonInput("");
    setData(null);
    setError("");
    setCopyStatus("");
  };

  const copyVisualToClipboard = async () => {
    if (!chartRef.current) return;

    try {
      setCopyStatus("copying");

      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopyStatus("success");
          setTimeout(() => setCopyStatus(""), 2000);
        } catch (err) {
          console.error("Clipboard failed:", err);
          setCopyStatus("error");
          setTimeout(() => setCopyStatus(""), 2000);
        }
      }, "image/png");
    } catch (err) {
      console.error("Screenshot failed:", err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const CopyButton = () => {
    return (
      <button
        onClick={copyVisualToClipboard}
        className={`px-4 py-2 bg-white border-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
          copyStatus === "success"
            ? "border-green-500 text-green-600 bg-green-50"
            : copyStatus === "error"
            ? "border-red-500 text-red-600 bg-red-50"
            : "border-blue-500 text-blue-600 hover:bg-blue-50"
        }`}
      >
        {copyStatus === "copying" ? (
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
        ) : copyStatus === "success" ? (
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

  // STEP 1: Report Type Selection
  if (!selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-8 text-white">
            <h1 className="text-4xl font-bold mb-3">📊 TechnoTest Reports</h1>
            <p className="text-xl opacity-90">
              Select report type, choose a specific chart, and generate with
              custom JSON data
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Step 1: Select Report Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setSelectedReport("coverage")}
                className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
              >
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Test Coverage Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Analyse requirements coverage, test case mapping, and
                  traceability metrics
                </p>
                <div className="text-sm text-blue-600 font-semibold">
                  {reportCharts.coverage.length} charts available →
                </div>
              </button>

              <button
                onClick={() => setSelectedReport("lab")}
                className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
              >
                <div className="text-4xl mb-3">🧪</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Test Lab Summary Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Track execution progress, pass/fail rates, and team velocity
                </p>
                <div className="text-sm text-green-600 font-semibold">
                  {reportCharts.lab.length} charts available →
                </div>
              </button>

              <button
                onClick={() => setSelectedReport("defect")}
                className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-red-500"
              >
                <div className="text-4xl mb-3">🐛</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Defect Analysis Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Analyse defect distribution, severity trends, and resolution
                  metrics
                </p>
                <div className="text-sm text-red-600 font-semibold">
                  {reportCharts.defect.length} charts available →
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Chart Selection
  if (!selectedChart) {
    const reportTitles = {
      coverage: "Test Coverage Report",
      lab: "Test Lab Summary Report",
      defect: "Defect Analysis Report",
    };

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedReport(null)}
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
          >
            ← Back to Report Types
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {reportTitles[selectedReport]}
            </h1>
            <p className="text-gray-600 mb-8">
              Select a specific chart to generate with your JSON data
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Step 2: Select Chart Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportCharts[selectedReport].map((chart) => (
                <button
                  key={chart.id}
                  onClick={() => setSelectedChart(chart.id)}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-5 text-left hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500 flex items-center gap-4"
                >
                  <div className="text-3xl">{chart.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {chart.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-semibold mt-1">
                      Click to configure →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: JSON Input
  if (!data) {
    const chartName = reportCharts[selectedReport].find(
      (c) => c.id === selectedChart
    )?.name;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBackToChartSelection}
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
          >
            ← Back to Chart Selection
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {chartName}
            </h1>
            <p className="text-gray-600 mb-8">
              Paste your JSON data or load sample to generate the chart
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
                  📝 Load Sample JSON
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`Paste JSON for ${chartName} or click "Load Sample JSON"...`}
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
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transform transition-all shadow-md"
              >
                🚀 Generate Chart
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 active:scale-95 transform transition-all"
              >
                🔄 Start Over
              </button>
            </div>

            {/* JSON Structure Help */}
            <div className="mt-8 p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="text-sm font-bold text-blue-900 mb-3">
                📋 Expected JSON Structure:
              </h3>
              <pre className="text-xs text-blue-800 overflow-x-auto bg-white p-4 rounded border border-blue-200">
                {JSON.stringify(sampleJSONs[selectedChart], null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 4: Chart Display
  const chartName = reportCharts[selectedReport].find(
    (c) => c.id === selectedChart
  )?.name;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{chartName}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setData(null)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
            >
              ← Edit JSON
            </button>
            <button
              onClick={handleBackToChartSelection}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800"
            >
              📊 New Chart
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900"
            >
              🏠 Home
            </button>
          </div>
        </div>

        {/* COVERAGE CHARTS */}
        {selectedChart === "executive-summary" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Executive Summary
              </h2>
              <CopyButton />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-center text-white">
                <div className="text-4xl font-bold mb-2">
                  {data.totalRequirements}
                </div>
                <div className="text-sm font-semibold">Total Requirements</div>
              </div>
              <div className="bg-gradient-to-br from-teal-300 to-teal-400 rounded-lg p-6 text-center text-white">
                <div className="text-4xl font-bold mb-2">{data.covered}</div>
                <div className="text-sm font-semibold">Covered</div>
              </div>
              <div className="bg-gradient-to-br from-red-300 to-red-400 rounded-lg p-6 text-center text-white">
                <div className="text-4xl font-bold mb-2">{data.notCovered}</div>
                <div className="text-sm font-semibold">Not Covered</div>
              </div>
              <div className="bg-gradient-to-br from-teal-300 to-teal-400 rounded-lg p-6 text-center text-white">
                <div className="text-4xl font-bold mb-2">
                  {data.coverageRate}%
                </div>
                <div className="text-sm font-semibold">Coverage Rate</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-lg p-6 text-center text-white">
                <div className="text-4xl font-bold mb-2">
                  {data.totalTestCases}
                </div>
                <div className="text-sm font-semibold">Total Test Cases</div>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "coverage-report" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Coverage Report
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  User story coverage breakdown
                </p>
              </div>
              <CopyButton />
            </div>

            {/* REMOVED SELECT METRIC DROPDOWN */}

            {data.metric === "user-story" ? (
              <div className="space-y-6">
                {data.userStories.map((item) => (
                  <div key={item.id}>
                    <div className="mb-2 text-sm text-gray-700">
                      <strong className="font-bold">{item.userStory}</strong> –{" "}
                      {item.description}
                    </div>
                    <div className="flex w-full h-12 rounded-lg overflow-hidden shadow-sm">
                      <div
                        className="flex items-center px-4 text-white font-semibold text-sm"
                        style={{
                          width: `${item.covered}%`,
                          backgroundColor: data.colors?.covered || "#10b981",
                        }}
                      >
                        {item.covered}% Covered ({item.coveredCount})
                      </div>
                      <div
                        className="flex items-center px-4 text-white font-semibold text-sm"
                        style={{
                          width: `${100 - item.covered}%`,
                          backgroundColor: data.colors?.notCovered || "#fb923c",
                        }}
                      >
                        {100 - item.covered}% ({item.notCoveredCount})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-2 text-sm text-gray-700">
                  <strong className="font-bold">{data.testPlan.name}</strong>
                </div>
                <div className="flex w-full h-12 rounded-lg overflow-hidden shadow-sm">
                  <div
                    className="flex items-center px-4 text-white font-semibold text-sm"
                    style={{
                      width: `${data.testPlan.covered}%`,
                      backgroundColor: data.colors?.covered || "#10b981",
                    }}
                  >
                    {data.testPlan.covered}% Covered (
                    {data.testPlan.coveredCount})
                  </div>
                  <div
                    className="flex items-center px-4 text-white font-semibold text-sm"
                    style={{
                      width: `${100 - data.testPlan.covered}%`,
                      backgroundColor: data.colors?.notCovered || "#fb923c",
                    }}
                  >
                    {100 - data.testPlan.covered}% (
                    {data.testPlan.notCoveredCount})
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-10 mt-8 pt-6 border-t border-gray-200 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: data.colors?.covered || "#10b981" }}
                ></div>
                <span className="text-gray-700">Covered</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: data.colors?.notCovered || "#fb923c",
                  }}
                ></div>
                <span className="text-gray-700">Not Covered</span>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "coverage-overview" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Coverage Overview
              </h2>
              <CopyButton />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className="rounded-lg p-6 text-center text-white"
                style={{
                  background: `linear-gradient(to bottom right, ${
                    data.colors?.totalUserStories || "#06b6d4"
                  }, ${data.colors?.totalUserStories || "#06b6d4"}CC)`,
                }}
              >
                <div className="text-4xl font-bold mb-2">
                  {data.totalUserStories}
                </div>
                <div className="text-sm font-semibold">Total User Stories</div>
              </div>
              <div
                className="rounded-lg p-6 text-center text-white"
                style={{
                  background: `linear-gradient(to bottom right, ${
                    data.colors?.fullCoverage || "#14b8a6"
                  }, ${data.colors?.fullCoverage || "#14b8a6"}CC)`,
                }}
              >
                <div className="text-4xl font-bold mb-2">
                  {data.fullCoverage}
                </div>
                <div className="text-sm font-semibold">Full Coverage</div>
              </div>
              <div
                className="rounded-lg p-6 text-center text-white"
                style={{
                  background: `linear-gradient(to bottom right, ${
                    data.colors?.partialCoverage || "#fbbf24"
                  }, ${data.colors?.partialCoverage || "#fbbf24"}CC)`,
                }}
              >
                <div className="text-4xl font-bold mb-2">
                  {data.partialCoverage}
                </div>
                <div className="text-sm font-semibold">Partial Coverage</div>
              </div>
              <div
                className="rounded-lg p-6 text-center text-white"
                style={{
                  background: `linear-gradient(to bottom right, ${
                    data.colors?.noCoverage || "#f87171"
                  }, ${data.colors?.noCoverage || "#f87171"}CC)`,
                }}
              >
                <div className="text-4xl font-bold mb-2">{data.noCoverage}</div>
                <div className="text-sm font-semibold">No Coverage</div>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "coverage-table" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Coverage by User Story
              </h2>
              <CopyButton />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      User Story ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      User Story
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Priority
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Test Requirements
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Covered
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Not Covered
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-center py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.stories.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-700">
                        {row.userStoryId}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {row.userStory}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            row.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {row.testRequirements}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {row.covered}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {row.notCovered}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            row.status === "Not Started"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-gray-500 hover:text-gray-700">
                          {/* HORIZONTAL KEBAB (3 dots) */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="5" cy="12" r="2"></circle>
                            <circle cx="12" cy="12" r="2"></circle>
                            <circle cx="19" cy="12" r="2"></circle>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LAB CHARTS */}
        {selectedChart === "lab-executive" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Executive Summary
              </h2>
              <CopyButton />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-blue-100 rounded-lg p-5 text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {data.totalTestCases}
                </div>
                <div className="text-xs font-semibold text-blue-900 mt-2">
                  Total Test Cases
                </div>
              </div>
              <div className="bg-purple-100 rounded-lg p-5 text-center">
                <div className="text-3xl font-bold text-purple-700">
                  {data.activeSuites}
                </div>
                <div className="text-xs font-semibold text-purple-900 mt-2">
                  Active Suites
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-5 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {data.passed}
                </div>
                <div className="text-xs font-semibold text-green-900 mt-2">
                  Passed
                </div>
              </div>
              <div className="bg-red-100 rounded-lg p-5 text-center">
                <div className="text-3xl font-bold text-red-700">
                  {data.failed}
                </div>
                <div className="text-xs font-semibold text-red-900 mt-2">
                  Failed
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-5 text-center">
                <div className="text-3xl font-bold text-gray-700">
                  {data.blocked}
                </div>
                <div className="text-xs font-semibold text-gray-900 mt-2">
                  Blocked
                </div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-5 text-center">
                <div className="text-3xl font-bold text-yellow-700">
                  {data.noRun}
                </div>
                <div className="text-xs font-semibold text-yellow-900 mt-2">
                  No Run
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMPROVED PIE CHART WITH ECHARTS */}
        {selectedChart === "execution-status" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Overall Execution Status
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Total: {data.total} Test Cases
                </p>
              </div>
              <CopyButton />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* ECHARTS PIE CHART */}
              <div className="w-96 h-96">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: "item",
                      formatter: "{a} <br/>{b}: {c} ({d}%)",
                    },
                    legend: {
                      show: false,
                    },
                    series: [
                      {
                        name: "Test Status",
                        type: "pie",
                        radius: ["40%", "70%"],
                        avoidLabelOverlap: false,
                        itemStyle: {
                          borderRadius: 10,
                          borderColor: "#fff",
                          borderWidth: 2,
                        },
                        label: {
                          show: false,
                          position: "center",
                        },
                        emphasis: {
                          label: {
                            show: true,
                            fontSize: 32,
                            fontWeight: "bold",
                            formatter: function (params) {
                              return (
                                Math.round((data.passed / data.total) * 100) +
                                "%\nPass Rate"
                              );
                            },
                          },
                        },
                        labelLine: {
                          show: false,
                        },
                        data: [
                          {
                            value: data.passed,
                            name: "Passed",
                            itemStyle: {
                              color: data.colors?.passed || "#3cb371",
                            },
                          },
                          {
                            value: data.failed,
                            name: "Failed",
                            itemStyle: {
                              color: data.colors?.failed || "#ff8c69",
                            },
                          },
                          {
                            value: data.blocked,
                            name: "Blocked",
                            itemStyle: {
                              color: data.colors?.blocked || "#c0c0c0",
                            },
                          },
                          {
                            value: data.noRun,
                            name: "No Run",
                            itemStyle: {
                              color: data.colors?.noRun || "#ffd700",
                            },
                          },
                        ],
                      },
                    ],
                    graphic: {
                      type: "text",
                      left: "center",
                      top: "center",
                      style: {
                        text:
                          Math.round((data.passed / data.total) * 100) +
                          "%\nPass Rate",
                        textAlign: "center",
                        fill: "#333",
                        fontSize: 32,
                        fontWeight: "bold",
                      },
                    },
                  }}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: data.colors?.passed || "#3cb371",
                      }}
                    ></div>
                    <span className="font-semibold text-gray-800">Passed</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">
                      {data.passed}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((data.passed / data.total) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: data.colors?.failed || "#ff8c69",
                      }}
                    ></div>
                    <span className="font-semibold text-gray-800">Failed</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-700">
                      {data.failed}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((data.failed / data.total) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: data.colors?.blocked || "#c0c0c0",
                      }}
                    ></div>
                    <span className="font-semibold text-gray-800">Blocked</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-700">
                      {data.blocked}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((data.blocked / data.total) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: data.colors?.noRun || "#ffd700",
                      }}
                    ></div>
                    <span className="font-semibold text-gray-800">No Run</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-700">
                      {data.noRun}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((data.noRun / data.total) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "suite-distribution" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Suite Status Distribution
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Total Suites: {data.total}
                </p>
              </div>
              <CopyButton />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3 text-base font-semibold">
                  <span className="text-gray-800">In Progress</span>
                  <span className="text-gray-600">
                    {data.inProgress} Suites
                  </span>
                </div>
                <div className="flex w-full h-14 rounded-lg shadow-md overflow-hidden">
                  <div
                    className="flex items-center px-4 text-white font-bold text-sm"
                    style={{
                      width: `${(data.inProgress / data.total) * 100}%`,
                      backgroundColor: data.colors?.inProgress || "#4169e1",
                    }}
                  >
                    {Math.round((data.inProgress / data.total) * 100)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3 text-base font-semibold">
                  <span className="text-gray-800">Completed</span>
                  <span className="text-gray-600">{data.completed} Suites</span>
                </div>
                <div className="flex w-full h-14 rounded-lg shadow-md overflow-hidden">
                  <div
                    className="flex items-center px-4 text-white font-bold text-sm"
                    style={{
                      width: `${(data.completed / data.total) * 100}%`,
                      backgroundColor: data.colors?.completed || "#3cb371",
                    }}
                  >
                    {Math.round((data.completed / data.total) * 100)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3 text-base font-semibold">
                  <span className="text-gray-800">Not Started</span>
                  <span className="text-gray-600">
                    {data.notStarted} Suites
                  </span>
                </div>
                <div className="flex w-full h-14 rounded-lg shadow-md overflow-hidden">
                  <div
                    className="flex items-center px-4 text-white font-bold text-sm"
                    style={{
                      width: `${(data.notStarted / data.total) * 100}%`,
                      backgroundColor: data.colors?.notStarted || "#c0c0c0",
                    }}
                  >
                    {Math.round((data.notStarted / data.total) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-10 mt-8 pt-6 border-t-2 border-gray-100 text-sm font-semibold">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{
                    backgroundColor: data.colors?.inProgress || "#4169e1",
                  }}
                ></div>
                <span className="text-gray-700">In Progress</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{
                    backgroundColor: data.colors?.completed || "#3cb371",
                  }}
                ></div>
                <span className="text-gray-700">Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{
                    backgroundColor: data.colors?.notStarted || "#c0c0c0",
                  }}
                ></div>
                <span className="text-gray-700">Not Started</span>
              </div>
            </div>
          </div>
        )}

        {/* IMPROVED PLATFORM EXECUTION - BETTER SMALL VALUE DISPLAY */}
        {selectedChart === "platform-execution" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Execution by Platform
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Cross-platform test results breakdown
                </p>
              </div>
              <CopyButton />
            </div>

            <div className="space-y-6">
              {data.platforms.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-3 text-base font-semibold">
                    <strong className="text-gray-800">{item.platform}</strong>
                    <span className="text-gray-600">{item.total} Tests</span>
                  </div>

                  {/* Stacked Bar */}
                  <div className="flex w-full h-14 rounded-lg shadow-md overflow-hidden mb-2">
                    {item.pass > 0 && (
                      <div
                        className="flex items-center justify-center text-white font-bold text-sm"
                        style={{
                          width: `${(item.pass / item.total) * 100}%`,
                          backgroundColor: data.colors?.pass || "#3cb371",
                          minWidth: item.pass > 0 ? "60px" : "0",
                        }}
                      >
                        {item.pass}
                      </div>
                    )}
                    {item.fail > 0 && (
                      <div
                        className="flex items-center justify-center text-white font-bold text-sm"
                        style={{
                          width: `${(item.fail / item.total) * 100}%`,
                          backgroundColor: data.colors?.fail || "#ff8c69",
                          minWidth: item.fail > 0 ? "50px" : "0",
                        }}
                      >
                        {item.fail}
                      </div>
                    )}
                    {item.blocked > 0 && (
                      <div
                        className="flex items-center justify-center font-bold text-sm text-gray-800"
                        style={{
                          width: `${(item.blocked / item.total) * 100}%`,
                          backgroundColor: data.colors?.blocked || "#c0c0c0",
                          minWidth: item.blocked > 0 ? "50px" : "0",
                        }}
                      >
                        {item.blocked}
                      </div>
                    )}
                    {item.noRun > 0 && (
                      <div
                        className="flex items-center justify-center font-bold text-sm text-gray-800"
                        style={{
                          width: `${(item.noRun / item.total) * 100}%`,
                          backgroundColor: data.colors?.noRun || "#ffd700",
                          minWidth: item.noRun > 0 ? "50px" : "0",
                        }}
                      >
                        {item.noRun}
                      </div>
                    )}
                  </div>

                  {/* Detailed breakdown below bar */}
                  <div className="flex gap-4 text-xs text-gray-600 ml-2">
                    <span>
                      Pass:{" "}
                      <strong className="text-green-700">{item.pass}</strong>
                    </span>
                    <span>
                      Fail:{" "}
                      <strong className="text-red-700">{item.fail}</strong>
                    </span>
                    <span>
                      Blocked:{" "}
                      <strong className="text-gray-700">{item.blocked}</strong>
                    </span>
                    {item.noRun > 0 && (
                      <span>
                        No Run:{" "}
                        <strong className="text-yellow-700">
                          {item.noRun}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-10 mt-8 pt-6 border-t-2 border-gray-100 text-sm font-semibold">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: data.colors?.pass || "#3cb371" }}
                ></div>
                <span className="text-gray-700">Pass</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: data.colors?.fail || "#ff8c69" }}
                ></div>
                <span className="text-gray-700">Fail</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: data.colors?.blocked || "#c0c0c0" }}
                ></div>
                <span className="text-gray-700">Blocked</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: data.colors?.noRun || "#ffd700" }}
                ></div>
                <span className="text-gray-700">No Run</span>
              </div>
            </div>
          </div>
        )}

        {/* DAILY EXECUTION - HORIZONTAL BARS */}
        {selectedChart === "daily-execution" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Daily Execution
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Test Velocity and Execution Trends
                </p>
              </div>
              <CopyButton />
            </div>

            <div className="space-y-5">
              {data.days.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {item.date}
                    </span>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-12 rounded-lg shadow-md overflow-hidden bg-gray-100">
                      <div
                        className="h-full flex items-center px-4 text-white font-bold text-sm"
                        style={{
                          width: `${(item.tests / 78) * 100}%`,
                          backgroundColor:
                            item.day === "today"
                              ? data.colors?.today || "#4169e1"
                              : data.colors?.completed || "#3cb371",
                          minWidth: "80px",
                        }}
                      >
                        {item.tests} Tests
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-10 mt-8 pt-6 border-t-2 border-gray-100 text-sm font-semibold">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{
                    backgroundColor: data.colors?.completed || "#3cb371",
                  }}
                ></div>
                <span className="text-gray-700">Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: data.colors?.today || "#4169e1" }}
                ></div>
                <span className="text-gray-700">Today</span>
              </div>
            </div>
          </div>
        )}

        {/* DEFECT CHARTS */}
        {selectedChart === "defect-executive" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Executive Summary
              </h2>
              <CopyButton />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="bg-gray-100 rounded-lg p-5 text-center">
                <div className="text-4xl font-bold text-gray-700">
                  {data.total}
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-2">
                  Total Defects
                </div>
              </div>
              <div className="bg-red-100 rounded-lg p-5 text-center">
                <div className="text-4xl font-bold text-red-700">
                  {data.critical}
                </div>
                <div className="text-sm font-semibold text-red-900 mt-2">
                  Critical
                </div>
              </div>
              <div className="bg-orange-100 rounded-lg p-5 text-center">
                <div className="text-4xl font-bold text-orange-700">
                  {data.high}
                </div>
                <div className="text-sm font-semibold text-orange-900 mt-2">
                  High
                </div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-5 text-center">
                <div className="text-4xl font-bold text-yellow-700">
                  {data.medium}
                </div>
                <div className="text-sm font-semibold text-yellow-900 mt-2">
                  Medium
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-5 text-center">
                <div className="text-4xl font-bold text-green-700">
                  {data.low}
                </div>
                <div className="text-sm font-semibold text-green-900 mt-2">
                  Low
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "defect-status" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Defect Status Overview
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Total Defects:{" "}
                  <span className="font-bold text-blue-600 text-lg">
                    {data.total}
                  </span>
                </p>
              </div>
              <CopyButton />
            </div>

            <div className="flex w-full h-20 rounded-lg shadow-md overflow-hidden mb-6">
              {data.statuses.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-white font-bold text-xs relative group transition-all hover:opacity-90"
                  style={{
                    width: `${(item.count / data.total) * 100}%`,
                    backgroundColor: item.color,
                    minWidth: "70px",
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
              {data.statuses.map((item, index) => (
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
                      {item.count} (
                      {Math.round((item.count / data.total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedChart === "defect-severity" && (
          <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Defect by Severity
              </h2>
              <CopyButton />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div
                className="rounded-lg p-6 text-center border-2"
                style={{
                  backgroundColor: `${data.colors?.critical || "#ef4444"}20`,
                  borderColor: data.colors?.critical || "#ef4444",
                }}
              >
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: data.colors?.critical || "#ef4444" }}
                >
                  {data.critical}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  Critical
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {Math.round((data.critical / data.total) * 100)}%
                </div>
              </div>
              <div
                className="rounded-lg p-6 text-center border-2"
                style={{
                  backgroundColor: `${data.colors?.high || "#fb923c"}20`,
                  borderColor: data.colors?.high || "#fb923c",
                }}
              >
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: data.colors?.high || "#fb923c" }}
                >
                  {data.high}
                </div>
                <div className="text-sm font-semibold text-gray-900">High</div>
                <div className="text-xs text-gray-600 mt-1">
                  {Math.round((data.high / data.total) * 100)}%
                </div>
              </div>
              <div
                className="rounded-lg p-6 text-center border-2"
                style={{
                  backgroundColor: `${data.colors?.medium || "#fbbf24"}20`,
                  borderColor: data.colors?.medium || "#fbbf24",
                }}
              >
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: data.colors?.medium || "#fbbf24" }}
                >
                  {data.medium}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  Medium
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {Math.round((data.medium / data.total) * 100)}%
                </div>
              </div>
              <div
                className="rounded-lg p-6 text-center border-2"
                style={{
                  backgroundColor: `${data.colors?.low || "#22c55e"}20`,
                  borderColor: data.colors?.low || "#22c55e",
                }}
              >
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: data.colors?.low || "#22c55e" }}
                >
                  {data.low}
                </div>
                <div className="text-sm font-semibold text-gray-900">Low</div>
                <div className="text-xs text-gray-600 mt-1">
                  {Math.round((data.low / data.total) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
