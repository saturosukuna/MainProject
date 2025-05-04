import React, { useState } from "react";
import { retrieveDataFromIPFS } from "./utils/ipfs";

const Log = ({ logs, isOpenModal, onClose }) => {
  const [logDataMap, setLogDataMap] = useState({});

  const fetchLogData = async (ipfsHash, index) => {
    if (logDataMap[ipfsHash]) return;
    try {
      const data = await retrieveDataFromIPFS(ipfsHash);
      setLogDataMap((prev) => ({ ...prev, [ipfsHash]: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error("Error fetching data from IPFS:", error);
      setLogDataMap((prev) => ({ ...prev, [ipfsHash]: [] }));
    }
  };

  const convertTimestamp = (timestamp) => {
    if (!timestamp) return "Invalid timestamp";
    try {
      let normalizedTimestamp = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
      if (normalizedTimestamp < 1e12) normalizedTimestamp *= 1000;
      return new Date(normalizedTimestamp).toLocaleString();
    } catch {
      return "Invalid timestamp";
    }
  };

  if (!isOpenModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white max-w-6xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-700 hover:text-red-500 font-bold"
        >
          ×
        </button>

        {logs.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mt-4">Logs</h2>
            <ul className="space-y-4 mt-2">
              {logs.map((log, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700">Victim: {log.victim || "N/A"}</p>
                  <p className="font-semibold text-gray-700">Modified By: {log.modifiedBy || "N/A"}</p>
                  <button
                    onClick={() => fetchLogData(log.ipfsHash, index)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mt-2"
                  >
                    View
                  </button>

                  {logDataMap[log.ipfsHash] && (
                    <div className="mt-2 p-2 bg-gray-100 rounded">
                      {logDataMap[log.ipfsHash].length > 0 ? (
                        logDataMap[log.ipfsHash].map((entry, idx) => (
                          <div key={idx} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <p className="font-semibold text-gray-800">Field: {entry.field || "N/A"}</p>
                            <p className="font-semibold text-gray-800">Old Value: {entry.oldValue || "N/A"}</p>
                            <p className="font-bold text-gray-600">New Value: {entry.newValue || "N/A"}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No changes recorded.</p>
                      )}
                    </div>
                  )}

                  <p className="font-extrabold text-gray-700">
                    Timestamp: {convertTimestamp(log.timestamp)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-700">No logs available</p>
        )}
      </div>
    </div>
  );
};

export default Log;