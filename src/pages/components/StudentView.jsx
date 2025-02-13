import React, { useRef } from "react";
import html2pdf from 'html2pdf.js';
import './StudentView.css'
const StudentInfoDisplay = ({ studentInfo, documents }) => {
  const contentRef = useRef();
  const downloadData = () => {
    const element = contentRef.current;
    console.log("called");
    html2pdf()
      .from(element)
      .set({
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .save('student-info.pdf');
  };
  const downloadPDF = (base64Data, filename = "document.pdf") => {
    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };



  return (
    <div className="max-w-full mx-auto  bg-white rounded-lg shadow-lg">
      <div ref={contentRef} className="student-info-container">
        <h2>Student Information</h2>
        <div className="student-info-grid">
          {Object.entries(studentInfo).map(([key, value]) => (
            <div key={key} className="student-info-item">
              <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong>
              <span>{value || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={downloadData} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Download as PDF
      </button>
      <h2 className="text-2xl font-bold mt-6 mb-4">Documents</h2>
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
        {Object.entries(documents).map(([key, value]) => (
          <div key={key} className="border-b py-2">
            <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>
            <span className="block text-gray-700">{value ? "Uploaded" : "Not Provided"}</span>
            <iframe src={`data:application/pdf;base64,${value}`} width="100%" height="500px"></iframe>
            <button onClick={() => downloadPDF(value)}>Download PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentInfoDisplay;