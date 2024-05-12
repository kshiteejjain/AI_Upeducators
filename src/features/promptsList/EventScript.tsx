import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EventScript = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        eventType: '',
        performanceList: '',
        additionalDetails: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a script for the ${formData.eventType} event. The script should include introductions, and transitions for the following Performances/Key Activities: ${formData.performanceList}. 
    Also consider these additional details in the output: ${formData.additionalDetails}.
    The script should be engaging, informative, and aligned with the event's objectives.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Event Script</h2>
            <h3>Generate tailored scripts for any school event.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="eventType">Event Type<span className="asterisk">*</span></label>
                    <input required className="form-control" name="eventType" onChange={handleInputChange} value={formData.eventType} placeholder="e.g., Cultural Event, Academic Ceremony, Sports Day, Prize Day, Quiz Competition, Talent Show, Annual Day, Graduation" />
                </div>
                <div className="form-group">
                    <label htmlFor="performanceList">Performance List or Key Activities<span className="asterisk">*</span></label>
                    <textarea required className="form-control" name="performanceList" onChange={handleInputChange} value={formData.performanceList} rows={5} placeholder="List the performances or segments that need to be introduced or highlighted in the script (e.g., Welcome Speech, Dance Performance, Award Ceremony)"></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <textarea className="form-control" name="additionalDetails" onChange={handleInputChange} value={formData.additionalDetails} rows={5} placeholder="e.g., Language Preference, Duration, Specific Theme, Any other additional information"></textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default EventScript;
