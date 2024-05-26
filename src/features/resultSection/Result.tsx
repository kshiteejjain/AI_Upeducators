import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { generatorPrompt, } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt } from '../../utils/sendPrompt';
import Button from '../../components/buttons/Button';
import Strings from '../../utils/en';
import NoDataFoundImage from '../../assets/no-data-found.svg';
import CopyClipboard from '../../assets/copyClipboard.svg';
import Play from '../../assets/play.svg';
import Stop from '../../assets/stop.svg';
import mp3Sound from '../../assets/result-audio.mp3';
import Loader from '../../components/loader/Loader';
import { getFollowupPrompts, getSuggestedForms } from '../../utils/followupPromptsService';
import ResponseFeedback from '../responseFeedback/responseFeedback';

import './Result.css';
import { setCategory } from '../categories/CategoriesSlice';

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

  const isFollowUpPrompt = useSelector((state: RootState) => state.generatorData?.isFollowUpPrompt)
  const getFormName = useSelector((state: RootState) => state?.selectedCategory)
  const resultAudio = useMemo(() => new Audio(mp3Sound), []);
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [getFollowPrompt, setGetFollowPrompt] = useState<string[]>([]);
  const [isSuggestedForms, setIsSuggestedForms] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null)
  const generatedDataOption = isFollowUpPrompt ? generatedData : generatedData?.slice(-2);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const content = generatedDataOption?.map((msg: any, index: number) => {
    if (!msg || !msg.content || typeof msg.content !== 'string') {
      return null; // Skip rendering if msg or msg.content is not valid
    }

    if (msg.role === 'user' && (msg.isVisible === false || msg.isVisible === undefined)) {
      return null;
    }

    const isTableResponse = msg.content.includes('table response:') || msg.content.includes('table response');
    const isSimpleTableFormat = msg.content.trim().split('\n').every((line: any) => /^\|.*\|$/.test(line.trim()));
    const renderBoldBeforeColon = (text: string) => {
      const parts = text.split(/(:\s*)/);
      return (
        <>
          <strong>{parts.shift()}</strong>
          {parts.join('')}
        </>
      );
    };

    return (
      <div className='response-data' key={index}>
        <div className={msg.role}>
          {msg.role === 'user' ? (
            <div dangerouslySetInnerHTML={{ __html: msg.content?.trim()?.replace(/\n/g, '<br />') }} />
          ) : (
            typeof msg.content === 'string' ? (
              isTableResponse ? (
                // Render the content as a table
                <table className='table-response'>
                  <tbody>
                    {msg.content.split('\n').map((line: any, lineIndex: number) => {
                      const columns = line.split('|').map((col: any) => col.trim()).filter((col: any) => col !== '');
                      return (
                        <tr key={lineIndex}>
                          {columns.map((col: any, colIndex: number) => (
                            <td key={colIndex}>{col}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : isSimpleTableFormat ? (
                // Render the simple table format "| Name | Value |"
                <table className='table-response'>
                  <tbody>
                    {msg.content.split('\n').map((line: any, lineIndex: number) => {
                      const columns = line.split('|').map((col: any) => col.trim()).filter((col: any) => col !== '');
                      return (
                        <tr key={lineIndex}>
                          {columns.map((col: any, colIndex: number) => (
                            <td key={colIndex}>{col}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                // Render the content as lines
                msg.content.split('\n').map((line: any, lineIndex: number) => (
                  <div key={lineIndex}>
                    {line.includes(':') ? (
                      renderBoldBeforeColon(line)
                    ) : line.trim().endsWith('?') || line.trim().endsWith(':') || line.trim().endsWith('!') ? (
                      <strong>{line}</strong>
                    ) : (
                      // Render each HTTP or HTTPS link as individual clickable links
                      line.split(/\b(https?:\/\/[^\s]+)\b/g).map((segment: any, segmentIndex: number) => {
                        if (segment.match(/^https?:\/\//)) {
                          return (
                            <a key={segmentIndex} href={segment} target="_blank">{segment}</a>
                          );
                        } else {
                          return (
                            <span key={segmentIndex}>{segment}</span>
                          );
                        }
                      })
                    )}
                    <br />
                  </div>
                ))
              )
            ) : (
              <div>{msg.content}</div> // Render the content as is if it's not a string
            )
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
    isSubmitClicked ? null : setIsLoading(loadingStatus === 'loading');
    generatedData?.length === 1 ? (resultAudio.play(), fetchFollowupPrompts(), fetchSuggestedForms()) : null;

  }, [generatedData, generatedImage, resultAudio]);

  async function fetchFollowupPrompts() {
    const followupPrompts = await getFollowupPrompts(getFormName?.selectedCategory);
    setGetFollowPrompt(followupPrompts);
  }

  async function fetchSuggestedForms() {
    const followupPrompts = await getSuggestedForms(getFormName?.selectedCategory);
    setIsSuggestedForms(followupPrompts);
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
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated_image.png';
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
    setIsSubmitClicked(true);
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage, isFollowUpPrompt: true });
    setFormData({
      followUpPromptInput: '',
    });
    setTimeout(() => {
      setIsSubmitClicked(false);
    }, 2000)
  };
  const scrollResultToBottom = () => {
    if (resultRef.current) {
      const resultDiv = resultRef.current;
      resultDiv.scrollTop = resultDiv.scrollHeight;
    }
  };

  // Use a timeout to scroll to the bottom after rendering changes
  useEffect(() => {
    setTimeout(() => {
      scrollResultToBottom();
    }, 0);
  }, [content]);

  const handleSuggestedForms = (item: any) => {
    dispatch(setCategory(item));
  }

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

        {generatedData?.length !== 0 && !generatedImage && (
          <>
            <button className='copyClipboard' title="Copy Content" onClick={handleCopyData}>
              <img src={CopyClipboard} alt="Copy to Clipboard" />
            </button>
          </>
        )}

        <div className='generatedImage'>
          {generatedImage && <img src={generatedImage} alt="Generated Image" />}
          {generatedImage && <Button title='Download Image' onClick={downloadImage} />}
        </div>


        {!generatedData?.length && !generatedImage && (
          <div className='noDataFoundImage'>
            <img src={NoDataFoundImage} alt="No Data Found" />
          </div>
        )}

      </div>

      {generatedData && getFollowPrompt.length !== 0 && !generatedImage && (
        <ResponseFeedback />
      )}

      {/* <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div> */}
      {generatedData && getFollowPrompt.length !== 0 && !generatedImage && (
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
        <form onSubmit={handleFollowupPromptSubmit} className='followUpPrompt'>
          <div className='form-group'>
            <input
              name="followUpPromptInput"
              required
              className='form-control'
              onChange={handleInputChange}
              value={formData.followUpPromptInput}
              autoComplete="off"
              placeholder="Ask Follow Up Questions..."
            />
          </div>
          <Button title='Send' type="submit" />
        </form>
      )}
      {generatedData && getFollowPrompt.length !== 0 && !generatedImage && (
        <div className="related-forms">
          <h2>{Strings.result.relatedFormsTitle}</h2>
            {isSuggestedForms.map((item, index) => (
              <a href='javascript:void(0)' key={index} onClick={()=> handleSuggestedForms(item)}>
                {item}
              </a>
            ))}
        </div>
      )}
    </div>
  );
};
export default Result;
