import { useSelector } from 'react-redux';
import NoDataFoundImage from '../../assets/no-data-found.svg';
import CopyClipboard from '../../assets/copyClipboard.svg';

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
  const generatedData = useSelector((state: RootState) => state.generatorData?.data?.choices[0].text);
  const questions = generatedData?.split(/\n\n\d+\) /).filter(Boolean);
  const questionElements = questions?.map((question, index) => (
    <div key={index} className="resultQuestions" dangerouslySetInnerHTML={{ __html: question.trim().replace(/\n/g, '<br />') }} />
  ));
  const handleCopyData = () => {
    alert('Result data copied and ready to paste')
    const textArea = document.createElement('textarea');
    textArea.value = generatedData || '';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };
  
  
  return (
    <>
      <div className="result-section">
        {generatedData ? <>{questionElements} <button className='copyClipboard' title="Copy Content" onClick={handleCopyData}><img src={CopyClipboard} /></button> </> : <div className='noDataFoundImage'> <img src={NoDataFoundImage} /></div>}
      </div>
    </>
  )
};

export default Result;