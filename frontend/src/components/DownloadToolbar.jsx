// import React from 'react';
// import { jsPDF } from 'jspdf';
// import { saveAs } from 'file-saver';
// import { Document, Packer, Paragraph, TextRun } from 'docx';

// const DownloadCode = ({ code }) => {
//   // Download as PDF
//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const lines = code.split('\n');

//     let y = 10;
//     const lineHeight = 7;

//     doc.setFont('Courier', 'normal');
//     doc.setFontSize(10);

//     lines.forEach((line) => {
//       doc.text(line || ' ', 10, y);
//       y += lineHeight;
//       if (y > 280) {
//         doc.addPage();
//         y = 10;
//       }
//     });

//     doc.save('code-output.pdf');
//   };

//   // Download as DOCX
//   const downloadDOCX = () => {
//     const lines = code.split('\n');
//     const doc = new Document({
//       sections: [
//         {
//           children: lines.map(
//             (line) =>
//               new Paragraph({
//                 children: [
//                   new TextRun({
//                     text: line || ' ',
//                     font: 'Courier New',
//                     size: 22, // ~11pt
//                   }),
//                 ],
//               })
//           ),
//         },
//       ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//       saveAs(blob, 'code-output.docx');
//     });
//   };

//   return (
//     <div className="flex gap-4">
//       <button onClick={downloadPDF} className="text-blue-600 underline">
//         Download as PDF
//       </button>
//       <button onClick={downloadDOCX} className="text-green-600 underline">
//         Download as DOCX
//       </button>
//     </div>
//   );
// };

// export default DownloadCode;












// import React, { useRef } from 'react';
// import html2pdf from 'html2pdf.js';

// const DownloadContent = ({ content, contentType = 'html' }) => {
//   const contentRef = useRef();

//   const downloadPDF = () => {
//     if (!contentRef.current) return;

//     // Create a hidden div to hold the content temporarily for PDF generation
//     const tempElement = document.createElement('div');
//     tempElement.style.position = 'absolute';
//     tempElement.style.top = '-9999px'; // Position it off-screen
//     //tempElement.style.visibility = 'hidden'; // Hide the element from view

//     // Clone the content and append it to the temporary element
//     if (contentType === 'html') {
//       tempElement.innerHTML = content; // For HTML content
//     } else {
//       tempElement.textContent = content; // For code content
//     }

//     // Append the temporary element to the body
//     document.body.appendChild(tempElement);

//     // Use html2pdf to create the PDF
//     html2pdf()
//       .from(tempElement)
//       .set({
//         margin: 10,
//         filename: 'document.pdf',
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//       })
//       .save()
//       .then(() => {
//         // After saving the PDF, remove the temporary element
//         document.body.removeChild(tempElement);
//       });
//   };

//   return (
//     <div>
//       {/* Button to trigger the PDF download */}
//       <div className="flex gap-4 mt-4">
//         <button onClick={downloadPDF} className="text-blue-600 underline">
//           Download as PDF
//         </button>
//       </div>

//       {/* Content rendered for PDF generation but not visible */}
//       {contentType === 'html' ? (
//         <div
//           ref={contentRef}
//           dangerouslySetInnerHTML={{ __html: content }}
//           style={{ display: 'none' }}
//         />
//       ) : (
//         <div
//           ref={contentRef}
//           style={{
//             display: 'none',
//             whiteSpace: 'pre-wrap',
//             fontFamily: 'monospace',
//           }}
//         >
//           {content}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DownloadContent;





import React from "react";

const DownloadContent = ({ content, type, fileName = "document" }) => {
  const handleDownload = (extension, mimeType) => {
    let blobContent = content;
    if (type === "html" && extension === "txt") {
      // Strip HTML tags if saving as plain text
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      blobContent = tempDiv.innerText;
    }

    const blob = new Blob([blobContent], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 mb-4 text-red-400">
      {type === "html" && (
        <>
          <button onClick={() => handleDownload("html", "text/html")}>
            Download HTML
          </button>
          <button onClick={() => handleDownload("txt", "text/plain")}>
            Download as Plain Text
          </button>
        </>
      )}

      {type === "markdown" && (
        <>
          <button onClick={() => handleDownload("html", "text/html")}>
            Download HTML
          </button>
          <button onClick={() => handleDownload("md", "text/markdown")}>
            Download MD
          </button>
        </>
      )}

      {type === "code" && (
        <button onClick={() => handleDownload("txt", "text/plain")}>
          Download Code (.txt)
        </button>
      )}
    </div>
  );
};

export default DownloadContent;
