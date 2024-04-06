import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const BlogTitleGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        audience: '',
        topic: '',
        keyword: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 engaging blog titles for the topic ${formData.topic}, tailored to the audience ${formData.audience}. The titles should be attention-grabbing and resonate with the target audience. Titles should include keyword: ${formData.keyword}`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Blog Titles</h2>
            <h3>Generate captivating blog titles for your topics.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="audience">Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. students, parents"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="topic">Topic<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="Best careers after 12th"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="keyword">Keyword to be included</label>
                    <input
                        className="form-control"
                        name="keyword"
                        onChange={handleInputChange}
                        value={formData.keyword}
                        placeholder="Eg. Exciting, Must choose"
                    />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default BlogTitleGenerator;