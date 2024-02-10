import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WebinarContentStories = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        webinarTitle: '',
        audience: '',
        contentType: 'Stories'
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `I am conducting a webinar on ${formData.webinarTitle}. The audience of the webinar is ${formData.audience}.  Duration is 90 minutes. Pls suggest me 5 interesting ${formData.contentType} that i can refer in the webinar.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Webinar Content: Stories/Example/Stats/Activities</h2>
            <h3>Generate engaging and informative webinar content like Stories /Example/Stats/Activities.</h3>
            <form onSubmit={handleSubmit}>
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

            </form>
        </div>
    )
};
export default WebinarContentStories;
