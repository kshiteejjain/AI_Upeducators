import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const KeywordSearch = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        mainKeyword: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a list of keywords with high searches about ${formData.mainKeyword}. Give only list of keywords. Do not give any description`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Keyword Search</h2>
            <h3>Generate high search volume keywords</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='mainKeyword'>Main Keyword<span className='asterisk'>*</span></label>
                    <input required className='form-control' name='mainKeyword' onChange={handleInputChange} value={formData.mainKeyword} placeholder='Maths classes for 8th and 9th' />
                </div>
                
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default KeywordSearch;