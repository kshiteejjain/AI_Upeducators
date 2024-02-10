import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SEOContentGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        pageTopic: '',
        targetAudience: '',
        primaryKeyword: '',
        secondaryKeyword: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate an SEO title tag (50-60 characters), meta description (150-160 characters), and a list of keywords for a web page about "${formData.pageTopic}" targeted at "${formData.targetAudience}". The primary keyword is "${formData.primaryKeyword}", and secondary keywords include ${formData.secondaryKeyword}.            `
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>SEO Content Generator</h2>
            <h3>Generate SEO-optimized content for web pages, including a title tag, meta description, and keywords.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='pageTopic'>Page Topic <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='pageTopic' onChange={handleInputChange} value={formData.pageTopic} placeholder='Enter the main topic of the page (e.g., "Online Education Tools").' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the target audience for the page (e.g., "Teachers, Educators").' />
                </div>
                <div className='form-group'>
                    <label htmlFor='primaryKeyword'>Primary Keyword <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='primaryKeyword' onChange={handleInputChange} value={formData.primaryKeyword} placeholder='Enter the primary keyword or phrase for SEO (e.g., "Best Online Teaching Platforms").' />
                </div>
                <div className='form-group'>
                    <label htmlFor='secondaryKeyword'>Secondary Keyword <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='secondaryKeyword' onChange={handleInputChange} value={formData.secondaryKeyword} placeholder='Enter the primary keyword or phrase for SEO (e.g., "Best Online Teaching Platforms").' />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default SEOContentGenerator;