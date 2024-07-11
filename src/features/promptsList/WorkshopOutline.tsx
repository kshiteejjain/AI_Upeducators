import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WorkshopOutline = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        workshopTitle: '',
        targetAudience: '',
        workshopDuration: '',
        additionalRequirements: '',
        workshopGoals: '',
        specialInstructions: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a workshop outline for this Title/Topic: ${formData.workshopTitle}. The targeted audience is ${formData.targetAudience} and the workshop should be based on these workshop goals: ${formData.workshopGoals}. The workshop duration is ${formData.workshopDuration}. 
    Also consider these additional requirements in the output: ${formData.additionalRequirements}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Workshop Outline</h2>
            <h3>Generate a detailed outline for your workshop.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience
<span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="targetAudience"
                        onChange={handleInputChange}
                        value={formData.targetAudience}
                        placeholder="e.g., Children, Teenagers, Adults, Mixed Age Groups, Working Professionals" />
                </div>

                <div className='form-group'>
                    <label htmlFor='workshopTitle'>Workshop Title/Topic
<span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="workshopTitle"
                        onChange={handleInputChange}
                        value={formData.workshopTitle}
                        placeholder="e.g., Creative Writing Essentials, Public Speaking, Environmental Awareness, Art and Craft" />
                </div>

                <div className='form-group'>
                    <label htmlFor='workshopDuration'>Workshop Duration
<span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="workshopDuration"
                        onChange={handleInputChange}
                        value={formData.workshopDuration}
                        placeholder="e.g., 30 minutes, 2 Class Periods, 1 Day" />
                </div>

                <div className='form-group'>
                    <label htmlFor='workshopGoals'>Workshop Goals</label>
                    <textarea
                        className='form-control'
                        name="workshopGoals"
                        onChange={handleInputChange}
                        value={formData.workshopGoals}
                        placeholder="e.g., enhance students' writing skills, foster creativity and artistic expression, raise awareness about environmental issues">
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalRequirements'>Additional Requirements</label>
                    <textarea
                        className='form-control'
                        name="additionalRequirements"
                        onChange={handleInputChange}
                        value={formData.additionalRequirements}
                        placeholder="e.g., Interactive activities, Prerequisites for attendees, Learning Resources, Pre-workshop Preparations, Additional Notes, Any special instruction or requirement">
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WorkshopOutline;
