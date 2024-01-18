import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
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

const WebinarContentStories = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    
    const [formData, setFormData] = useState({
        webinarTitle: '',
        audience: '',
        contentType: 'Stories'
    });

    const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const sendPrompt = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const promptMessage = `I am conducting a webinar on ${formData.webinarTitle}. The audience of the webinar is ${formData.audience}.  Duration is 90 minutes. Pls suggest me 5 interesting ${formData.contentType} that i can refer in the webinar.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Webinar Content: Stories/Example/Stats/Activities</h2>
            <h3>Generate engaging and informative webinar content like Stories /Example/Stats/Activities.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='webinarTitle'>Webinar Title<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='webinarTitle'
                        onChange={handleInputChange}
                        value={formData.webinarTitle}
                        placeholder='Enter the Title of the Webinar'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='audience'
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder='Enter the Title of the Webinar'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='contentType'>Content Type <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="contentType" onChange={handleInputChange} value={formData.contentType}>
                        <option value="Stories">Stories</option>
                        <option value="Examples">Examples</option>
                        <option value="Statistics">Statistics</option>
                        <option value="Activities">Activities</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'>Your Prompt Message: <br /><strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default WebinarContentStories;
