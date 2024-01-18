import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/buttons/Button';
import NoDataFoundImage from '../../assets/no-data-found.svg';
import CopyClipboard from '../../assets/copyClipboard.svg';
import mp3Sound from '../../assets/result-audio.mp3';

import './Result.css';


type RootState = {
  generatorData: {
    data: {
      choices: {
        text: string;
      }[];
    };
  };
};

const Result = () => {
  const generatedData = useSelector((state: RootState) => state?.generatorData?.data?.choices?.[0]?.text);
  const generatedImage = useSelector((state: RootState) => state?.generatorData?.data?.data?.[0]?.url);

  const questions = generatedData?.split(/\n\n\d+\) /).filter(Boolean);
  const questionElements = questions?.map((question, index) => (
    <div key={index} className="resultQuestions" dangerouslySetInnerHTML={{ __html: question.trim().replace(/\n/g, '<br />') }} />
  ));

  const resultAudio = useMemo(() => new Audio(mp3Sound), []);

  useEffect(() => {
    if (generatedData !== undefined || generatedImage !== undefined) {
      resultAudio.play();
    }
  }, [generatedData, generatedImage, resultAudio]);

  const handleCopyData = () => {
    alert('Result data copied and ready to paste.')
    const textArea = document.createElement('textarea');
    textArea.value = generatedData || '';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const downloadImage = () => {
    if (generatedImage) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated_image.png'; // You can customize the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="result-section">
        {generatedData ? (
          <>
            {questionElements}
            <button className='copyClipboard' title="Copy Content" onClick={handleCopyData}>
              <img src={CopyClipboard} alt="Copy to Clipboard" />
            </button>
          </>
        ) : (
          generatedImage &&<div className='generatedImage'> <img src={generatedImage} alt="Generated Image" /> </div>
        ) || (
          <div className='noDataFoundImage'>
            <img src={NoDataFoundImage} alt="No Data Found" />
          </div>
        )}
        {generatedImage && <Button title='Download Image' onClick={downloadImage} />}
      </div>

    </>
  )
};

export default Result;
