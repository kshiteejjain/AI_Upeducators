import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const BlogOutline = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        blogTitle: '',
        audience: '',
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `I want to write a blog on ${formData.blogTitle}, the audience of my blog is ${formData.audience}. Please give me the outline of the blog which will help me in writing an engaging blog.     `;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Blog Outline</h2>
            <h3>Generate the detailed outline for your blog title</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="blogTitle"> Blog Title
                        <span className="asterisk">*</span>
                    </label>
                    <input
                        required
                        className="form-control"
                        name="blogTitle"
                        onChange={handleInputChange}
                        value={formData.blogTitle}
                        placeholder="Eg. Mastering Public Speaking: Tips and Tricks for College Students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="audience"> Audience
                        <span className="asterisk">*</span>
                    </label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. College students, Parents, Students, Professionals"
                    />
                </div>

                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default BlogOutline;
