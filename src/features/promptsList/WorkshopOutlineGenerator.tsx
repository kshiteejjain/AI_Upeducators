import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WorkshopOutlineGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        workshopTitle: '',
        targetAudience: '',
        workshopDuration: '',
        mainTopics: '',
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
    const promptMessage = `Create a workshop outline for "${formData.workshopTitle}" targeted at ${formData.targetAudience}. The workshop will last for ${formData.workshopDuration}. Key topics include: ${formData.mainTopics}. The goals of the workshop are ${formData.workshopGoals}. Special instructions: ${formData.specialInstructions}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Workshop Outline Generator</h2>
            <h3>This tool helps in designing detailed outlines for various types of workshops.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='workshopTitle'> Workshop Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='workshopTitle' onChange={handleInputChange} value={formData.workshopTitle} placeholder='Enter the title of the workshop.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'> Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify who the workshop is intended for.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='workshopDuration'> Workshop Duration <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='workshopDuration' onChange={handleInputChange} value={formData.workshopDuration} placeholder='Mention the total duration of the workshop (e.g., 2 hours, 3 days).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='mainTopics'> Main Topics </label>
                    <textarea className='form-control' name='mainTopics' onChange={handleInputChange} rows={5} value={formData.mainTopics} placeholder='List the main topics that will be covered in the workshop.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='workshopGoals'> Workshop Goals </label>
                    <textarea className='form-control' name='workshopGoals' onChange={handleInputChange} rows={5} value={formData.workshopGoals} placeholder='Describe the key objectives and goals of the workshop.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='specialInstructions'> Special Instructions </label>
                    <textarea className='form-control' name='specialInstructions' onChange={handleInputChange} rows={5} value={formData.specialInstructions} placeholder='Include any special instructions or prerequisites for attendees.'> </textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WorkshopOutlineGenerator;
