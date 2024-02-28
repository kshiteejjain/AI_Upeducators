import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SocialMediaCalendarGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        noOfDays: '',
        selectDays: 'days',
        audience: '',
        theme: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a social media calendar for ${formData.noOfDays} days in a table. My audience is ${formData.audience}. Theme is ${formData.theme}. Content ideas should be engaging so that posts get more likes, comments, saves and shares and also promote follows and should cover all popular formats mentioning the format. Table should have Serial number, Content idea and Format.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Social Media Calendar Generator</h2>
            <h3>Generate Effective Sales pitch for your Services to convert your Prospects.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='noOfDays'>Number of Days/months <span className='asterisk'>*</span></label>
                    <input type='number' required className='form-control' name='noOfDays' onChange={handleInputChange} value={formData.noOfDays} placeholder='Enter the number of days/months for the social media calendar.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='selectDays'>Select Days/months <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="selectDays" onChange={handleInputChange} value={formData.selectDays}>
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience<span className='asterisk'>*</span></label>
                    <input type='text' className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Identify your primary audience, such as students, parents, or educators.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='theme'>Themes/Topics</label>
                    <input type='text' className='form-control' name='theme' onChange={handleInputChange} value={formData.theme} placeholder='Describe the central themes or topics for your posts, like educational tips or course information. Ex: yoga tips for kids.' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default SocialMediaCalendarGenerator;
