import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const IntroParagraphForWebsite = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        seoKeyword: '',
        pageTitle: '',
        wordCount: '',
        additionalDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Craft an introductory ${formData.wordCount} word paragraph for a website page titled ${formData.pageTitle} with a focus on SEO keywords like ${formData.seoKeyword}. Ensure it emphasizes ${formData.additionalDetails} and entices readers to explore further content on the page.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Intro Paragraph for Website</h2>
            <h3>Generate an engaging introductory paragraph for your website.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="seoKeyword">SEO keyword</label>
                    <input
                        className="form-control"
                        name="seoKeyword"
                        onChange={handleInputChange}
                        value={formData.seoKeyword}
                        placeholder="Eg. maths classes in jaipur, abacus classes for kids"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pageTitle">Page Title <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="pageTitle"
                        onChange={handleInputChange}
                        value={formData.pageTitle}
                        placeholder="Eg. Maths Classes in Jaipur for 8th Grade Students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="wordCount">Word Count <span className="asterisk">*</span></label>
                    <input
                        required
                        type="text"
                        className="form-control"
                        name="wordCount"
                        onChange={handleInputChange}
                        value={formData.wordCount}
                        placeholder="Eg. 50, 60"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <input
                        type="text"
                        className="form-control"
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="Eg. Training by Maths specialist"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default IntroParagraphForWebsite;