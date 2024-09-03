import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatorPrompt, resetGeneratedData } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import { useDispatch, useSelector } from 'react-redux';
import useSpeechToText from 'react-hook-speech-to-text';
import { sendPrompt } from '../../utils/sendPrompt';
import DownloadWordFile from './DownloadWordFile';
import Button from '../../components/buttons/Button';
import Strings from '../../utils/en';
import Play from '../../assets/play.svg';
import Stop from '../../assets/stop.svg';
import mp3Sound from '../../assets/result-audio.mp3';
import Loader from '../../components/loader/Loader';
import { getFollowupPrompts, getSuggestedForms } from '../../utils/followupPromptsService';
import ResponseFeedback from '../responseFeedback/responseFeedback';
import EmptyState from '../../assets/empty-state.gif';
import CopyClipboard from '../../assets/copyClipboard.svg';
import More from '../../assets/more.svg';
import Download from '../../assets/download.svg';
import mic from '../../assets/mic.svg';
import { setCategory } from '../categories/CategoriesSlice';
import CreateGoogleForms from "../../utils/CreateGoogleForms";

import './Result.css';

type RootState = {
  imageData: any;
  selectedCategory: any;
  generatorData: {
    isFollowUpPrompt: boolean;
    status: any;
    messages: string;
    data: {
      choices: {
        text: string;
      }[];
    };
  };
};

const Result = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const generatedData = useSelector((state: RootState) => state?.generatorData?.messages);
  const generatedImage = useSelector((state: RootState) => state?.imageData?.data?.data?.[0]?.url);

  const isFollowUpPrompt = useSelector((state: RootState) => state.generatorData?.isFollowUpPrompt);
  const getFormName = useSelector((state: RootState) => state?.selectedCategory);
  const resultAudio = useMemo(() => new Audio(mp3Sound), []);
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [getFollowPrompt, setGetFollowPrompt] = useState<string[]>([]);
  const [isSuggestedForms, setIsSuggestedForms] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBubbleLoader, setIsBubbleLoader] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);
  const generatedDataOption = isFollowUpPrompt ? generatedData : generatedData?.slice(-2);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const extractTableContent = (text: string) => {
    const tableSections = [];
    const tableRegex = /StartTable([\s\S]*?)EndTable/g;
    let match;
    while ((match = tableRegex.exec(text)) !== null) {
      tableSections.push(match[1].trim());
    }
    return tableSections;
  };

  const renderTable = (tableContent: string) => {
    const rows = tableContent.split('\n').filter(line => line.trim() !== '');
    return (
      <table className='table-response'>
        <tbody>
          {rows.map((row, rowIndex) => {
            const columns = row.split('|').map(col => col.trim()).filter(col => col !== '');
            return (
              columns.length > 0 && (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{col}</td>
                  ))}
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    );
  };

  // Helper function to apply rich text formatting
  const formatText = (text: string) => {
    // Handle headers (e.g., # Header, ## Subheader)
    text = text.replace(/^(#{1,6})\s*(.+)$/gm, (match, p1, p2) => {
      const level = p1.length;
      return `<h${level}>${p2}</h${level}>`;
    });

    // Handle bold text (e.g., **bold**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle bullet points (e.g., - bullet)
    text = text.replace(/^-+\s*(.*)$/gm, '$1');
    text = text.replace(/<\/li>(?=\s*<li>)/g, '</li><ul>').replace(/<\/li>(?=\s*$)/g, '</li></ul>');

    return text;
  };

  const content = generatedDataOption?.map((msg: any, index: number) => {
    if (!msg || !msg.content || typeof msg.content !== 'string') {
      return null; // Skip rendering if msg or msg.content is not valid
    }

    if (msg.role === 'user' && (msg.isVisible === false || msg.isVisible === undefined)) {
      return null;
    }

    const tableContents = extractTableContent(msg.content);
    const nonTableContent = msg.content.replace(/StartTable[\s\S]*?EndTable/g, '');

    return (
      <div className='response-data' key={index}>
        <div className={msg.role}>
          {tableContents.length > 0 && tableContents.map((tableContent, i) => (
            <div key={`table-${i}`}>
              {renderTable(tableContent)}
            </div>
          ))}
          {nonTableContent.trim() && (
            <div dangerouslySetInnerHTML={{ __html: formatText(nonTableContent.trim()).replace(/\n/g, '<br />') }} />
          )}
        </div>
      </div>
    );
  });

  const speakText = () => {
    const speech = new SpeechSynthesisUtterance(generatedData[generatedData.length - 1].content);
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
    speech.onend = () => {
      setIsSpeaking(false);
    };
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (!isSubmitClicked) {
      setIsLoading(loadingStatus === 'loading');
      setIsBubbleLoader(false);
    }
    generatedData?.length === 1 ? (resultAudio.play(), fetchFollowupPrompts(), fetchSuggestedForms()) : null;

  }, [generatedData, generatedImage, resultAudio]);

  async function fetchFollowupPrompts() {
    const followupPrompts = await getFollowupPrompts(getFormName?.selectedCategory);
    setGetFollowPrompt(followupPrompts);
  }

  async function fetchSuggestedForms() {
    const suggestedForms = await getSuggestedForms(getFormName?.selectedCategory);
    setIsSuggestedForms(suggestedForms);
  }

  const handleCopyData = () => {
    alert('Result data copied and ready to paste.');
    const textArea = document.createElement('textarea');
    textArea.value = generatedData?.map((msg: any) => msg.content).join('\n') || '';
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
    followUpPromptInput: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const promptMessage = `${formData.followUpPromptInput}`;

  const handleFollowupPromptSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBubbleLoader(true);
    setIsSubmitClicked(true);
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage, isFollowUpPrompt: true });
    setFormData({
      followUpPromptInput: '',
    });
    setTimeout(() => {
      setIsSubmitClicked(false);
    }, 2000);
  };

  const scrollResultToBottom = () => {
    if (resultRef.current) {
      const resultDiv = resultRef.current;
      resultDiv.scrollTop = resultDiv.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollResultToBottom();
    }, 0);
  }, [content]);

  const handleSuggestedForms = (item: any) => {
    dispatch(setCategory(item));
    dispatch(resetGeneratedData());
    navigate('/GeneratorAndResult');
  };

  // Speech recognition
  const { isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
    continuous: false,
    useLegacyResults: false,
    timeout: 500,
  });

  useEffect(() => {
    const lastTranscript = results.length > 0 ? results[results.length - 1].transcript : '';

    if (!isRecording && lastTranscript) {
      setFormData(() => ({
        followUpPromptInput: lastTranscript,
      }));
    }
  }, [results, isRecording]);

  const handleRecordClick = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setFormData(prevData => ({
        ...prevData,
        followUpPromptInput: '',  // Reset followUpPromptInput when starting new recording
      }));
      startSpeechToText();
    }
  };

  return (
    <div className="result-section" ref={resultRef}>
      {isLoading && <Loader isSwipeText />}

      <div className="result-section-inner">
        {content}

        {generatedData?.length !== 0 && !generatedImage && loadingStatus === 'succeeded' && (
          isSpeaking ? (
            <button className='speech-btn' onClick={stopSpeech}> <img src={Stop} /></button>
          ) : (
            <button className='speech-btn' onClick={speakText}> <img src={Play} /> </button>
          )
        )}
        <div className='generatedImage'>
          {generatedImage && <img src={generatedImage} alt="Generated Image" />}
          {generatedImage && <Button title='Download Image' onClick={downloadImage} />}
        </div>

        {!generatedData?.length && !generatedImage && (
          <div className='noDataFoundImage'>
            <a href='https://www.upeducators.com/' target='_blank'> <img src={EmptyState} alt="Empty State" /> </a>
          </div>
        )}
      </div>

      {generatedData && getFollowPrompt.length !== 0 && !generatedImage && loadingStatus === 'succeeded' && (
        <ResponseFeedback />
      )}
      {(loadingStatus === 'loading' && isBubbleLoader) && <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>}

      {generatedData && getFollowPrompt.length !== 0 && !generatedImage && loadingStatus === 'succeeded' && (
        <div className="followup-prompts">
          <h2>{Strings.result.followupTitle}</h2>
          <ul>
            {getFollowPrompt.map((prompt, index) => (
              <li key={index} onClick={() => setFormData({ followUpPromptInput: prompt })}>
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {generatedData?.length >= 1 && !generatedImage && (
        <div className='followUpPrompt'>
          <form onSubmit={handleFollowupPromptSubmit}>
            <div className='form-group'>
              <input
                name="followUpPromptInput"
                required
                className='form-control'
                onChange={handleInputChange}
                value={formData.followUpPromptInput}
                autoComplete="off"
                placeholder={localStorage.getItem('curForm') === 'Interview a Famous Personality' ? 'Ask your Next question' : localStorage.getItem('curForm') === 'Mock Interview' ? 'Type or Record your response' : 'Ask Follow Up Questions...'}
              />
            </div>
            <Button title='Send' type="submit" />
          </form>
          {(localStorage.getItem('curForm') === 'Mock Interview' || localStorage.getItem('curForm') === 'Interview a Famous Personality') &&
            <div className='recording-options'>
              <div className='recording-options-items'>
                <button className='record' onClick={handleRecordClick}> {isRecording ? <img src={Stop} title='Stop Recording' /> : <img src={mic} title='Start Recording' />}  </button>
              </div>
            </div>}
        </div>
      )}
      {generatedData && isSuggestedForms[0] !== undefined && !generatedImage && (
        <div className="related-forms">
          <h2>{Strings.result.relatedFormsTitle}</h2>
          <ul>
            {isSuggestedForms.map((item, index) => (
              <li key={index}>
                <a href='javascript:void(0)' key={index} onClick={() => handleSuggestedForms(item)}>
                  {item.split(/(?=[A-Z])/).join(' ')}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {generatedData?.length !== 0 && !generatedImage && (
        <>
          <div className='copyClipboard'>
            <img src={More} alt="More Actions" />
            <ul className='action-list'>
              <li onClick={handleCopyData}><img src={CopyClipboard} alt="Copy Content" /> Copy Content</li>
              <li> <img src={Download} alt="Download Word File" />
                <DownloadWordFile data={generatedData.map((msg: any) => msg.content).join('\n')} fileName={getFormName?.selectedCategory || 'document.docx'} />
              </li>
              <li><CreateGoogleForms /></li>
            </ul>
          </div>
        </>
      )}

    </div>
  );
};

export default Result;
