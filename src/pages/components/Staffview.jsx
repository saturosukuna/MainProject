import React, { useRef, useState, useEffect } from "react";
import html2pdf from 'html2pdf.js';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { retrieveDataFromIPFS } from "./utils/ipfs";
import InfoPDF from './staffpdf';

const StaffInfoDisplay = ({ staffInfo, publications, documents }) => {
  console.log(publications,"publications");
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
      .save('staff-info.pdf');
  };

  const downloadPDF = (base64Data, filename = "document.pdf") => {
    if (!base64Data) return;
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
    <div className="max-w-full mt-4 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div ref={contentRef} className="student-info-container">
        <h2 className="text-2xl font-bold mb-4">Staff Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(staffInfo).map(([key, value]) => (
            <div key={key} className="student-info-item">
              <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>
              <span>{value || "N/A"}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-6 mb-4">Publications</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
         {Object.values(publications).length > 0 ? (
  Object.values(publications).map((pub, index) => (
    <div key={index} className="border-b py-2">
      <strong className="capitalize text-lg">Publication {index + 1}</strong>
      <div className="mt-2 space-y-1">
        <p><strong>Title:</strong> {pub.title || "N/A"}</p>
        <p><strong>Journal:</strong> {pub.journal || "N/A"}</p>
        <p><strong>Publication Date:</strong> {pub.publicationDate || "N/A"}</p>
        <p><strong>DOI:</strong> {pub.doi || "N/A"}</p>
        <p><strong>Authors:</strong> {pub.authors || "N/A"}</p>
      </div>
    </div>
  ))
) : (
  <p>No publications available.</p>
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
          document={<InfoPDF Info={staffInfo} publications={publications} />}
          fileName="staff-info.pdf"
          style={{
            padding: '8px 16px',
            backgroundColor: '#27ae60',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          {({ loading }) => (loading ? 'Preparing...' : 'Download As PDF')}
        </PDFDownloadLink>

        {showViewer && (
          <div style={{ marginTop: '20px' }}>
            <PDFViewer style={{ width: '100%', height: '90vh' }}>
              <InfoPDF Info={staffInfo} publications={publications} />
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

export default StaffInfoDisplay;