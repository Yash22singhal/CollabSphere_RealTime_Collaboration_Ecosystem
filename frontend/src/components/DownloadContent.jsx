// import React from "react";
// import html2pdf from "html2pdf.js";
// import { marked } from "marked";

// const DownloadToolbar = ({ content, type, fileName = "document", language }) => {
//   const download = (data, extension, mimeType) => {
//     const blob = new Blob([data], { type: mimeType });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${fileName}.${extension}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleDownload = (format) => {
//     let plainText = content;
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = content;
//     const extractedText = tempDiv.innerText;
//     var ext;
//     switch (format) {
//       case "text":
//         switch (language) {
//           case "javascript":
//             ext = "js";
//             break;
//           case "python":
//             ext = "py";
//             break;
//           case "c++":
//             ext = "cpp";
//             break;
//           case "java":
//             ext = "java";
//             break;
//           case "c":
//             ext = "c";
//             break;
//           case "typescript":
//             ext = "ts";
//             break;
//           case "go":
//             ext = "go";
//             break;
//           case "ruby":
//             ext = "rb";
//             break;
//           default:
//             ext = "txt";
//         }
//         download(content, ext, "text");
//         break;

//       case "md":
//         download(content, "md", "text/markdown");
//         break;

//       case "pdf":
//         if (type == 'markdown'){
//           var element = `<div>${marked.parse(content || "")}</div>`;
//         } 
//         else{
//           var element = `<div>${content}</div>`;
//         }
//         var opt = {
//           margin: 1,
//           filename: fileName,
//           image: { type: "jpeg", quality: 0.98 },
//           html2canvas: { scale: 2, height: document.body.scrollHeight + 100 },
//           jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
//         };

//         // New Promise-based usage:
//         html2pdf().from(element).set(opt).save();
//         break;

//       default:
//         console.warn("Unknown format");
//     }
//   };

//   return (
//     <div className="flex gap-2 mb-4 flex-wrap text-red-500">
//       {type === "html" && (
//         <>
//           <button onClick={() => handleDownload("pdf")}>Download PDF</button>
//           {/* <button onClick={() => handleDownload("docx")}>Download DOCX</button> */}
//         </>
//       )}

//       {type === "markdown" && (
//         <>
//           <button onClick={() => handleDownload("md")}>Download MD</button>
//           <button onClick={() => handleDownload("pdf")}>Download PDF</button>
//           {/* <button onClick={() => handleDownload("docx")}>Download DOCX</button> */}
//         </>
//       )}

//       {type === "code" && (
//         <>
//           <button onClick={() => handleDownload("text")}>Download Code</button>
//           <button onClick={() => handleDownload("pdf")}>Download PDF</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default DownloadToolbar;










import React from "react";
import html2pdf from "html2pdf.js";
import { marked } from "marked";
import {
  FaFilePdf,
  FaMarkdown,
  FaCode,
  FaDownload
} from "react-icons/fa";

const DownloadToolbar = ({ content, type, fileName = "document", language, className="" }) => {
  const download = (data, extension, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = (format) => {
    let plainText = content;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const extractedText = tempDiv.innerText;
    let ext;

    switch (format) {
      case "text":
        switch (language) {
          case "javascript": ext = "js"; break;
          case "python": ext = "py"; break;
          case "c++": ext = "cpp"; break;
          case "java": ext = "java"; break;
          case "c": ext = "c"; break;
          case "typescript": ext = "ts"; break;
          case "go": ext = "go"; break;
          case "ruby": ext = "rb"; break;
          default: ext = "txt";
        }
        download(content, ext, "text/plain");
        break;

      case "md":
        download(content, "md", "text/markdown");
        break;

      case "pdf":
        const htmlContent =
          type === "markdown"
            ? `<div>${marked.parse(content || "")}</div>`
            : `<div>${content}</div>`;

        const opt = {
          margin: 1,
          filename: `${fileName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, height: document.body.scrollHeight + 100 },
          jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
        };

        html2pdf().from(htmlContent).set(opt).save();
        break;

      default:
        console.warn("Unknown format");
    }
  };

  const Button = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-white/20 text-balck font-semibold border border-white/30 rounded-xl shadow transition-all duration-200 hover:scale-105 ${className}`}
    >
      <Icon />
      <span className="text-sm sm:text-base">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-wrap gap-3">
      {type === "html" && (
        <Button icon={FaFilePdf} label="Download PDF" onClick={() => handleDownload("pdf")} />
      )}

      {type === "markdown" && (
        <>
          <Button icon={FaMarkdown} label="Download MD" onClick={() => handleDownload("md")} />
          <Button icon={FaFilePdf} label="Download PDF" onClick={() => handleDownload("pdf")} />
        </>
      )}

      {type === "code" && (
        <>
          <Button icon={FaCode} label="Download Code" onClick={() => handleDownload("text")} />
          <Button icon={FaFilePdf} label="Download PDF" onClick={() => handleDownload("pdf")} />
        </>
      )}
    </div>
  );
};

export default DownloadToolbar;
