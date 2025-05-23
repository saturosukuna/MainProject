import React, { useRef, useState } from "react";
import html2pdf from 'html2pdf.js';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import InfoPDF from './studentpdf';
import './StudentView.css'

const StudentInfoDisplay = ({ studentInfo, academicMarks, documents }) => {
  const contentRef = useRef();
  const [showViewer, setShowViewer] = useState(false);

  const downloadData = () => {
    const element = contentRef.current;
    html2pdf()
      .from(element)
      .set({
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .save('student-info.pdf');
  };

  const downloadPDF = (base64Data, filename = "document.pdf") => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg">
      <div ref={contentRef} className="student-info-container">
        <h2 className="text-2xl font-bold mb-4">Student Information</h2>
        <div className="student-info-grid">
          {Object.entries(studentInfo).map(([key, value]) => (
            <div key={key} className="student-info-item">
              <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong>
              <span>{value || 'N/A'}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-6 mb-4">Academic Marks</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5">
          {academicMarks && typeof academicMarks === "object" ? (
            Object.entries(academicMarks).map(([semester, marks]) => (
              <div key={semester} className="border-b py-2">
                <strong className="capitalize text-lg">
                  Semester {semester.replace("sem", "")}
                </strong>
                <div className="mt-2">
                  <p><strong>CGPA:</strong> {marks.cgpa || "N/A"}</p>
                  <p><strong>OGPA:</strong> {marks.ogpa || "N/A"}</p>
                  <p><strong>Percentage:</strong> {marks.percentage || "N/A"}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No academic marks available</p>
          )}
        </div>
      </div>

      <button onClick={downloadData} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Save As Screenshot
      </button>
      <div className="py-4">
        <button
          onClick={() => setShowViewer(!showViewer)}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: '#2c3e50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {showViewer ? 'Hide PDF' : 'View PDF'}
        </button>

        <PDFDownloadLink
          document={<InfoPDF Info={studentInfo} academicMarks={academicMarks} />}
          fileName="student-info.pdf"
          style={{
            padding: '8px 16px',
            backgroundColor: '#27ae60',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          {({ loading }) => (loading ? 'Preparing...' : 'Download PDF')}
        </PDFDownloadLink>

        {showViewer && (
          <div style={{ marginTop: '20px' }}>
            <PDFViewer style={{ width: '100%', height: '90vh' }}>
              <InfoPDF Info={studentInfo} academicMarks={academicMarks} />
            </PDFViewer>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mt-6 mb-4">Documents</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5">
        {Object.entries(documents).map(([key, value]) => (
          <div key={key} className="border-b py-2">
            <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>
            {value ? (
              <>
                <span className="block text-gray-700">Uploaded</span>
                <iframe src={`data:application/pdf;base64,${value}`} width="100%" height="500px"></iframe>
                <button
                  onClick={() => downloadPDF(value, `${key}.pdf`)}
                  className="mt-2 p-2 bg-green-500 text-white rounded"
                >
                  Download PDF
                </button>
              </>
            ) : (
              <span className="block text-gray-700">Not Provided</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentInfoDisplay;