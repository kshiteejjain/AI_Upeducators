import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import Loader from '../../components/loader/Loader';
import { AnyAction } from '@reduxjs/toolkit';

type GeneratorData = {
    status: string;
};

type RootState = {
    target: { name: string; value: string; };
    generatorData: GeneratorData;
    status: string;
    e: Event;
    onChange: () => void;
};

type EmailFormState = {
    recipientName: string;
    keyPoints: string;
    responseTone: string;
    lengthAndDetail: string;
    emailContent: string;
};

const EmailResponderGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState<EmailFormState>({
        recipientName: '',
        keyPoints: '',
        responseTone: 'Formal',
        lengthAndDetail: '',
        emailContent: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const sendPrompt = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const promptMessage = `Craft a professional response email to ${formData.recipientName} regarding ${formData.keyPoints}. The tone and style should be ${formData.responseTone}, and the email should be ${formData.lengthAndDetail}. The content of the email that I have received is ${formData.emailContent}`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Email Responder Generator</h2>
            <h3>Create tailored responses to received emails, ensuring a professional and appropriate reply for various contexts.</h3>
            <form onSubmit={sendPrompt}>
                {/* Recipient Information */}
                <div className='form-group'>
                    <label htmlFor='recipientName'> Recipient's Name <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='recipientName' onChange={handleInputChange} value={formData.recipientName} placeholder='Enter the full name of the email recipient.' />
                </div>

                {/* Key Points to Address and additional information */}
                <div className='form-group'>
                    <label htmlFor='keyPoints'> Key Points to Address and additional information <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='keyPoints' onChange={handleInputChange} rows={5} value={formData.keyPoints} placeholder='List the main points or questions in the received email that need to be addressed in your response and include any additional information or context.'> </textarea>
                </div>

                {/* Response Tone */}
                <div className='form-group'>
                    <label htmlFor='responseTone'> Response Tone <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="responseTone" onChange={handleInputChange} value={formData.responseTone}>
                        <option value="Formal">Formal</option>
                        <option value="Informal">Informal</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Assertive">Assertive</option>
                        <option value="Sympathetic">Sympathetic</option>
                        <option value="Convincing">Convincing</option>
                        <option value="Polite">Polite</option>
                        <option value="Requesting">Requesting</option>
                    </select>
                </div>

                {/* Length and Detail */}
                <div className='form-group'>
                    <label htmlFor='lengthAndDetail'> Length and Detail<span className='asterisk'>*</span> </label>
                    <input className='form-control' name="lengthAndDetail" onChange={handleInputChange} value={formData.lengthAndDetail} placeholder='Specify the desired length and level of detail for the email (e.g., brief and concise, detailed and informative).' />
                </div>

                {/* Content of the Email You're Responding To */}
                <div className='form-group'>
                    <label htmlFor='emailContent'> Content of the Email You're Responding To <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='emailContent' onChange={handleInputChange} rows={5} value={formData.emailContent} placeholder='Paste the content of the email you are responding to.'> </textarea>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    );
};

export default EmailResponderGenerator;
