import React from "react";

const IframePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Embed Specific Content</h1>

      <iframe
        src="https://annamalaiuniversity.ac.in/E08_factmem.php?dc=E08"  // Replace with the URL of the website you want to embed
        width="100%"
        height="600px"
        frameBorder="0"
        title="Embedded Website"
        className="rounded-lg shadow-md"
        style={{
          position: "relative",
          overflow: "hidden",
          objectFit: "cover",
        }}
      ></iframe>
    </div>
  );
};

export default IframePage;
