import React, { useState } from "react";
import { retrieveDataFromIPFS } from "./utils/ipfs";

const Log = ({ logs }) => {
  const [logDataMap, setLogDataMap] = useState({}); // Store data for each log separately

  const fetchLogData = async (ipfsHash, index) => {
    if (logDataMap[ipfsHash]) return; // Avoid refetching if already fetched

    try {
      const data = await retrieveDataFromIPFS(ipfsHash);
      setLogDataMap((prev) => ({ ...prev, [ipfsHash]: data })); // Store data for specific log
    } catch (error) {
      console.error("Error fetching data from IPFS:", error);
    }
  };
  const convertTimestamp = (timestamp) => {
    if (!timestamp) return "Invalid timestamp";

    // Convert BigInt to Number (if necessary)
    let normalizedTimestamp = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;

    // Convert seconds to milliseconds (only if timestamp is too small)
    if (normalizedTimestamp < 1e12) {
      normalizedTimestamp *= 1000; // Convert seconds to milliseconds
    }

    const date = new Date(normalizedTimestamp);
    return date.toLocaleString();
  };

  // Example Usage:
  // Output: "2/10/2025, 12:00:00 AM" (format depends on locale)


  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mt-4">Logs</h2>

      {logs.length > 0 ? (
        <ul className="space-y-4">
          {logs.map((log, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">Victim: {log.victim}</p>
              <p className="font-semibold text-gray-700">Modified By: {log.modifiedBy}</p>
              <button
                onClick={() => fetchLogData(log.ipfsHash, index)}
                className="bg-green-500 text-white px-4  rounded hover:bg-yellow-600 mt-2">
                View
              </button>

              {/* Show fetched log data if available */}
              {logDataMap[log.ipfsHash] && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  {Object.entries(logDataMap[log.ipfsHash]).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <p className="font-semibold text-gray-800">Old Value: {key}</p>
                      <p className="font-bold text-gray-600">New Value: {value}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="font-extrabold text-gray-700">
                Timestamp: {convertTimestamp(log.timestamp)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No logs available</p>
      )}
    </div>
  );
};

export default Log;
