import React from "react";
import html2pdf from "html2pdf.js";
import { marked } from "marked";

const DownloadToolbar = ({ content, type, fileName = "document", language }) => {
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
    var ext;
    switch (format) {
      case "text":
        switch (language) {
          case "javascript":
            ext = "js";
            break;
          case "python":
            ext = "py";
            break;
          case "c++":
            ext = "cpp";
            break;
          case "java":
            ext = "java";
            break;
          case "c":
            ext = "c";
            break;
          case "typescript":
            ext = "ts";
            break;
          case "go":
            ext = "go";
            break;
          case "ruby":
            ext = "rb";
            break;
          default:
            ext = "txt";
        }
        download(content, ext, "text");
        break;

      case "md":
        download(content, "md", "text/markdown");
        break;

      case "pdf":
        if (type == 'markdown'){
          var element = `<div>${marked.parse(content || "")}</div>`;
        } 
        else{
          var element = `<div>${content}</div>`;
        }
        var opt = {
          margin: 1,
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, height: document.body.scrollHeight + 100 },
          jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
        };

        // New Promise-based usage:
        html2pdf().from(element).set(opt).save();
        break;

      //   case "docx":
      //     const docxContent = htmlDocx.asBlob(content);
      //     download(docxContent, "docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      //     break;

      default:
        console.warn("Unknown format");
    }
  };

  return (
    <div className="flex gap-2 mb-4 flex-wrap text-red-500">
      {type === "html" && (
        <>
          <button onClick={() => handleDownload("pdf")}>Download PDF</button>
          {/* <button onClick={() => handleDownload("docx")}>Download DOCX</button> */}
        </>
      )}

      {type === "markdown" && (
        <>
          <button onClick={() => handleDownload("md")}>Download MD</button>
          <button onClick={() => handleDownload("pdf")}>Download PDF</button>
          {/* <button onClick={() => handleDownload("docx")}>Download DOCX</button> */}
        </>
      )}

      {type === "code" && (
        <>
          <button onClick={() => handleDownload("text")}>Download Code</button>
          <button onClick={() => handleDownload("pdf")}>Download PDF</button>
        </>
      )}
    </div>
  );
};

export default DownloadToolbar;
