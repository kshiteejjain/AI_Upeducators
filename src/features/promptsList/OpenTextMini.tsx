import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSpeechToText from 'react-hook-speech-to-text';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
import mic from '../../assets/mic.svg'
import micMuted from '../../assets/micMuted.svg'

const OpenText = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        description: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `${formData.description}.`

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    // speech recognition
    const { error, isRecording, results, startSpeechToText, stopSpeechToText, } = useSpeechToText({
        continuous: false,
        useLegacyResults: false,
        timeout: 500,
    });

    useEffect(() => {
        // Get the transcript of the last result
        const lastTranscript = results.length > 0 ? results[results.length - 1].transcript : '';
        setFormData(prevData => ({
            ...prevData,
            description: lastTranscript,
        }));

        // Check if recording has finished and then submit form data
        if (!isRecording && formData.description !== "") {
            handleSubmit(event);
        }
        setTimeout(() => {
            
        }, 3000)
    }, [results, isRecording]);


    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

    return (
        <div className="generator-section">
            <h2>Open Text Mini</h2>
            <h3>Open Text Mini</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='description'>Description</label>
                    <textarea required className='form-control' name='description' onChange={handleInputChange} rows={10} value={formData.description} placeholder='Add your description'> </textarea>
                </div>
                <Button title='Generate' type="submit" />
                <div className='recording-options'>
                    <div className='recording-options-items'>
                        <button className='record' onClick={isRecording ? stopSpeechToText : startSpeechToText}> {isRecording ? <img src={micMuted} title='Stop Recording' /> : <img src={mic} title='Start Recording' />}  </button>
                        <p>{isRecording && "Start Speaking..."}</p>
                    </div>
                </div>
            </form>
        </div>
    )
};
export default OpenText;