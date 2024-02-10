import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const PPTOutlineCreator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        presentationTitle: '',
        audience: '',
        numberOfSlides: '',
        additionalNotes: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a PPT outline for "${formData.presentationTitle}" targeted at ${formData.audience}. The presentation will consist of ${formData.numberOfSlides} slides. Additional notes: ${formData.additionalNotes}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>PPT Outline Creator</h2>
            <h3>This tool assists in structuring the outline for PowerPoint presentations.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='presentationTitle'> Presentation Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='presentationTitle' onChange={handleInputChange} value={formData.presentationTitle} placeholder='Enter the title of your presentation.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'> Audience </label>
                    <input className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify the target audience for your presentation.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='numberOfSlides'> Number of Slides </label>
                    <input type="number" className='form-control' name='numberOfSlides' onChange={handleInputChange} value={formData.numberOfSlides} placeholder='Enter the desired number of slides in the presentation.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalNotes'> Additional Notes </label>
                    <textarea className='form-control' name='additionalNotes' onChange={handleInputChange} rows={5} value={formData.additionalNotes} placeholder='Include any additional notes or specific instructions related to the presentation design or content.'></textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default PPTOutlineCreator;
