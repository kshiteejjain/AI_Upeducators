import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { generatorPrompt, } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt } from '../../utils/sendPrompt';
import Button from '../../components/buttons/Button';
import NoDataFoundImage from '../../assets/no-data-found.svg';
import ThumbsUp from '../../assets/thumb-up.svg';
import CopyClipboard from '../../assets/copyClipboard.svg';
import mp3Sound from '../../assets/result-audio.mp3';
import Loader from '../../components/loader/Loader';
import { getFollowupPrompts } from '../../utils/followupPromptsService';

import './Result.css';
import { collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';

type RootState = {
  generatorData: {
    isFollowUpPrompt: boolean;
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
  const dispatch = useDispatch();
  const resultRef = useRef<HTMLDivElement | null>(null)
  const generatedDataOption = isFollowUpPrompt ? generatedData : generatedData?.slice(-2);

  const content = generatedDataOption?.map((msg, index) => {
    if (!msg || !msg.content || typeof msg.content !== 'string') {
      return null; // Skip rendering if msg or msg.content is not valid
    }

    if (msg.role === 'user' && (msg.isVisible === false || msg.isVisible === undefined)) {
      return null;
    }

    return (
      <div className='response-data' key={index}>
        <div className={msg.role}>
          {msg.role === 'user' ? (
            <div dangerouslySetInnerHTML={{ __html: msg.content?.trim()?.replace(/\n/g, '<br />') }} />
          ) : (
            // Check if msg.content is a string before splitting
            typeof msg.content === 'string' ? (
              // Splitting the content into lines
              msg.content.split('\n').map((line, lineIndex) => (
                <div key={lineIndex}>
              {line.trim().endsWith('?') || line.trim().endsWith(':') || line.trim().endsWith('!') ? (
                <strong>{line}</strong>
              ) : (
                // Render each HTTP or HTTPS link as individual clickable links
                line.split(/\b(https?:\/\/[^\s]+)\b/g).map((segment, segmentIndex) => {
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
            ) : (
              <div>{msg.content}</div> // Render the content as is if it's not a string
            )
          )}
        </div>
      </div>
    );
  });



  useEffect(() => {
    isSubmitClicked ? null : setIsLoading(loadingStatus === 'loading');
    generatedData?.length === 2 ? (resultAudio.play(), fetchFollowupPrompts()) : null;

  }, [generatedData, generatedImage, resultAudio]);

  async function fetchFollowupPrompts() {
    const followupPrompts = await getFollowupPrompts(getFormName?.selectedCategory);
    setGetFollowPrompt(followupPrompts);
  }

  const handleCopyData = () => {
    alert('Result data copied and ready to paste.');
    const textArea = document.createElement('textarea');
    textArea.value = generatedData?.map(msg => msg.content).join('\n') || '';
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

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
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



  return (
    <div className="result-section" ref={resultRef}>
      {isLoading && <Loader isSwipeText />}

      <div className="result-section-inner">
        {content}
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
        <div className="response-feedback">
          <img src={ThumbsUp} alt='Like Response' title='Like Response' />
          <img src={ThumbsUp} alt='Need Improvement' title='Need Improvement' />
        </div>
      )}
      {generatedData && getFollowPrompt.length !== 0 && !generatedImage && (
        <div className="followup-prompts">
          <h2>Followup Query?</h2>
          <ul>
            {getFollowPrompt.map((prompt, index) => (
              <li key={index} onClick={() => setFormData({ followUpPromptInput: prompt })}>
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {generatedData?.length >= 2 && !generatedImage && (
        <form onSubmit={handleSubmit} className='followUpPrompt'>
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
    </div>
  );
};
export default Result;
