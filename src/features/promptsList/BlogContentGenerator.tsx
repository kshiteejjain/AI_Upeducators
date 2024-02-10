import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const BlogContentGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        audience: '',
        topic: '',
        tone: 'Informative',
        wordCount: '100 words',
        keyPoints: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a ${formData.wordCount} word blog post for ${formData.audience} on the topic of ${formData.topic}. The blog should have a ${formData.tone} tone and cover the following key points: ${formData.keyPoints}. The content should be engaging, informative, and relevant to the target audience. If some fields are left blank, the AI will make default choices to complete the blog.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
       setFormData(getInitialFormData);
    };
   
    return (
        <div className="generator-section">
            <h2>Blog Content Generator</h2>
            <h3>Create engaging and informative blog content for a specific audience on a chosen topic.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify the target audience, such as educators, students, parents, tech enthusiasts, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='topic' onChange={handleInputChange} value={formData.topic} placeholder='Describe the blog topic, like "Online Learning Trends" or "Innovative Classroom Technologies".' />
                </div>
                <div className='form-group'>
                    <label htmlFor='tone'> Tone <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="tone" onChange={handleInputChange} value={formData.tone}>
                        <option value="Informative"> Informative</option>
                        <option value="Persuasive">Persuasive</option>
                        <option value="Beginner">Entertaining</option>
                        <option value="Inspirational">Inspirational</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='wordCount'> Word Count </label>
                    <select className='form-control' name="wordCount" onChange={handleInputChange} value={formData.wordCount}>
                        <option value="500 Words">500 words</option>
                        <option value="1000 Words">1000 words</option>
                        <option value="1500 Words">1500 words</option>
                        <option value="2000 Words">2000 words</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keyPoints'>Key Points</label>
                    <input required className='form-control' name='keyPoints' onChange={handleInputChange} value={formData.keyPoints} placeholder='List key points or subtopics to cover in the blog, separated by commas. If left blank, general content based on the topic will be generated.' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default BlogContentGenerator;