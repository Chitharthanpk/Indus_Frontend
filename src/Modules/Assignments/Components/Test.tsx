import React, { useState } from "react";
import TestList from "./TestList";

export default function Test() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showTable, setShowTable] = useState(false);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!id.trim() || !password.trim()) {
      setError("Please fill in both Test ID and Test Password.");
      setShowTable(false);
    } else {
      setError("");
      setId("");
      setPassword("");
      setShowTable(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 px-2 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Test</h2>

      {!showTable ? (
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white border-2 border-gray-300 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="bg-blue-900 text-white py-4 px-6 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold">Login</h1>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 mb-1">Test ID</span>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Test ID"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 mb-1">Test Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Test Password"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="w-28 bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <div>
              <button
                onClick={() => setShowTable(false)}
                className="text-sm px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>

          {/* Call the separate TestResultsTable component */}
          <TestList/>
        </div>
      )}
    </div>
  );
}
