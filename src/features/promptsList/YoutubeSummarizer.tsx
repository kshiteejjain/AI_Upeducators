import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const YoutubeSummarizer = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const [videoId, setVideoId] = useState('');
    const [transcript, setTranscript] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const fetchTranscript = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3000/transcript/${videoId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const transcriptData = await response.json();
            setTranscript(transcriptData);
        } catch (err) {
            setError('Failed to fetch transcript');
        } finally {
            setLoading(false);
        }
    };

    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        textLength: '',
        otherTextLength: '', // New state for handling 'Other' text length
        contentType: '',
        otherContentType: '', // New state for handling 'Other' content type
        specialInstructions: '',
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Update formData based on input type
        if (name === 'textLength' && value === 'Other') {
            setFormData((prevData) => ({
                ...prevData,
                textLength: value,
                otherTextLength: '', // Reset other text length input when selecting 'Other'
            }));
        } else if (name === 'contentType' && value === 'Other') {
            setFormData((prevData) => ({
                ...prevData,
                contentType: value,
                otherContentType: '', // Reset other content type input when selecting 'Other'
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const promptMessage = `Generate original academic content for ${formData.gradeLevel} focusing on this Topic / Learning Objective: ${formData.topic}. The content should be approximately ${formData.textLength === 'Other' ? formData.otherTextLength : formData.textLength} in length. Special instructions: ${formData.specialInstructions}. Additionally, include references and citations. This content should be tailored to be educational and engaging for the specified grade level and subject matter. The content type is ${formData.contentType === 'Other' ? formData.otherContentType : formData.contentType}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Youtube Summarizer</h2>
            <h3>Generate Youtube Summary from youtube video Id.</h3>
            <form onSubmit={fetchTranscript}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Youtube Video Id<span className="asterisk">*</span></label>
                    <input
                        type="text"
                        placeholder="Enter YouTube Video ID"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                        required
                        className='form-control'
                    />
                </div>
                <Button title='Fetch Summery' type="submit" />
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul className='youtube-transcript'>
                {transcript.map((item, index) => (
                    <li key={index}>{item?.text} <span>Duration: {item.duration} Offset: {item.offset}</span> </li>
                ))}
            </ul>
        </div>
    );
};

export default YoutubeSummarizer;
