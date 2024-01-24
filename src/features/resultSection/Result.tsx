import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { ThunkDispatch } from 'redux-thunk';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import { AnyAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
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
  const generatedData = useSelector((state: RootState) => state?.generatorData?.responses);
  
  const generatedImage = useSelector((state: RootState) => state?.generatorData?.data?.data?.[0]?.url);
  const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();
  const resultAudio = useMemo(() => new Audio(mp3Sound), []);

  const questions = generatedData?.map(response => response?.data?.choices[0]?.message?.content);
  const questionElements = questions?.map((question, index) => (
    <div key={index} className="resultQuestions" dangerouslySetInnerHTML={{ __html: question?.trim()?.replace(/\n/g, '<br />') }} />
  ));

  useEffect(() => {
    if (generatedData.length !== 0) {
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

  const [formData, setFormData] = useState({
    additionalData: '',
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendPrompt = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const promptMessage = `${formData.additionalData}`
      dispatchThunk(generatorPrompt(promptMessage));
      setFormData({
        additionalData: '',
      });
    } catch (error) {
      alert('Error fetching data:', error);
    }
  };

  return (
    <>
      <div className="result-section">
        {generatedData.length !== 0 ? (
          <>
            {questionElements}
            <button className='copyClipboard' title="Copy Content" onClick={handleCopyData}>
              <img src={CopyClipboard} alt="Copy to Clipboard" />
            </button>
          </>
        ) : (
          generatedImage && <div className='generatedImage'> <img src={generatedImage} alt="Generated Image" /> </div>
        ) || (
          <div className='noDataFoundImage'>
            <img src={NoDataFoundImage} alt="No Data Found" />
          </div>
        )}
        {generatedImage && <Button title='Download Image' onClick={downloadImage} />}

       {generatedData.length !== 0 ? <form onSubmit={sendPrompt} className='followUpPrompt'>
          <div className='form-group'>
            <input name="additionalData" required className='form-control' onChange={handleInputChange} value={formData.additionalData} autoComplete="off" placeholder="Ask Follow Up Questions..." />
          </div>
          <Button title='Submit' type="submit" />
        </form> : null} 
      </div>

    </>
  )
};

export default Result;
