import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WebinarContentStoriesExampleStatsActivities = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        webinarTitle: '',
        audience: '',
        duration: '',
        contentType: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `I am conducting a webinar on ${formData.webinarTitle}. The audience of the webinar is ${formData.audience}.  Duration is ${formData.duration}. Pls suggest me 5 interesting ${formData.contentType} that i can refer in the webinar.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Webinar Content: Stories/Example/Stats/Activities</h2>
            <h3>Generate Stories/Example/Stats/Activities for the Webinar</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="webinarTitle"> Webinar Title <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="webinarTitle"
                        onChange={handleInputChange}
                        value={formData.webinarTitle}
                        placeholder="Eg. Careers after 12th"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="audience"> Audience <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Parents, Indian students, Teenagers"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="duration"> Duration <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="duration"
                        onChange={handleInputChange}
                        value={formData.duration}
                        placeholder="Eg. 1 hour, 90 minutes"
                    />
                </div>


                <div className='form-group'>
                    <label htmlFor='contentType'> Content Type </label>
                    <select className='form-control' name="contentType" onChange={handleInputChange} value={formData.contentType}>
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
export default WebinarContentStoriesExampleStatsActivities;