import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from "file-saver";

type Props = {
  data: string;
  fileName: string;
};

const DownloadWordFile = ({ data, fileName }: Props) => {
  const handleExportDoc = () => {
    // Function to format the text according to the rules
    const formatText = (text) => {
      // Regular expression to match numbers followed by a dot
      const numberRegex = /^\d+\./;
      const parts = text.split(/(\d+\.\s)/g); // Split by numbers followed by a dot and space
      const formattedText = [];
  
      for (let i = 0; i < parts.length; i++) {
        if (numberRegex.test(parts[i].trim())) {
          // Insert a line break before numbers followed by a dot
          formattedText.push(new TextRun({ text: '\n', font: 'Arial', size: 24 }));
          formattedText.push(new TextRun({ text: parts[i].trim(), font: 'Arial', size: 24 }));
        } else {
          // Split the current part by period and space
          const lineParts = parts[i].split('. ');
          for (let j = 0; j < lineParts.length; j++) {
            if (lineParts[j].includes(':')) {
              // Make the word before the colon bold
              const [beforeColon, afterColon] = lineParts[j].split(':');
              formattedText.push(new TextRun({ text: beforeColon, bold: true, font: 'Arial', size: 24 }));
              formattedText.push(new TextRun({ text: ': ' + afterColon, font: 'Arial', size: 24 }));
            } else {
              formattedText.push(new TextRun({ text: lineParts[j], font: 'Arial', size: 24 }));
            }
  
            // Add period and space after each part except the last one
            if (j < lineParts.length - 1) {
              formattedText.push(new TextRun({ text: '. ', font: 'Arial', size: 24 }));
              // Add a line break after each period and space
              formattedText.push(new TextRun({ text: '\n', font: 'Arial', size: 24 }));
            }
          }
        }
  
        // Add line break after each part except the last one
        if (i < parts.length - 1 && !numberRegex.test(parts[i + 1])) {
          formattedText.push(new TextRun({ text: '\n', font: 'Arial', size: 24 }));
        }
      }
    
      return formattedText;
    };
    

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: formatText(data),
              spacing: { line: 1.5 * 240 }, // Line height: 1.5 times 240 (24pt font size)
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, fileName || 'document.docx');
      console.log("Document created successfully");
    });
  };

  return <span onClick={handleExportDoc}>Download Word File</span>;
};

export default DownloadWordFile;
