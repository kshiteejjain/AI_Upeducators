import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const BlogContent = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        audience: '',
        blogTitle: '',
        wordCount: '',
        mustIncludeThisPoint: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a ${formData.wordCount} word blog post for ${formData.audience} on the topic of ${formData.blogTitle}. The blog should cover the following key points: ${formData.mustIncludeThisPoint}. The content should be engaging, informative, and relevant to the target audience. If some fields are left blank, the AI will make default choices to complete the blog.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Blog Content</h2>
            <h3>Create engaging blog content for a chosen topic.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="audience">Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Parents, students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="blogTitle">Blog Title<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="blogTitle"
                        onChange={handleInputChange}
                        value={formData.blogTitle}
                        placeholder="Eg. why kids should learn coding"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="wordCount">Word Count<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="wordCount"
                        onChange={handleInputChange}
                        value={formData.wordCount}
                    >
                        <option value="500">500</option>
                        <option value="800">800</option>
                        <option value="1000">1000</option>
                        <option value="1200">1200</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="mustIncludeThisPoint">Must include this point/Outline</label>
                    <textarea
                        className="form-control"
                        name="mustIncludeThisPoint"
                        onChange={handleInputChange}
                        value={formData.mustIncludeThisPoint}
                        rows={5}
                        placeholder="Eg. how coding is important for career"
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default BlogContent;