import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SEOForWebsite = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        pageTitle: '',
        targetAudience: '',
        mustHaveKeyword: '',
        otherKeywords: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate an SEO title tag (40-50 characters), meta description (140-150 characters), Page title and one liner that helps SEO for a web page about ${formData.pageTitle} targeted at ${formData.targetAudience}. The primary keyword is ${formData.mustHaveKeyword}, and secondary keywords include ${formData.otherKeywords}`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>SEO for Website</h2>
            <h3>Generate SEO title tag, meta description, page headlines & intro paragraph.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="pageTitle">Page Title <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="pageTitle"
                        onChange={handleInputChange}
                        value={formData.pageTitle}
                        placeholder="Eg. Yoga classes, Dance classes"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="targetAudience">Target Audience <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="targetAudience"
                        onChange={handleInputChange}
                        value={formData.targetAudience}
                        placeholder="Eg. Housewives, Students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mustHaveKeyword">Must have Keyword</label>
                    <input
                        className="form-control"
                        name="mustHaveKeyword"
                        onChange={handleInputChange}
                        value={formData.mustHaveKeyword}
                        placeholder="Eg. yoga classes in mumbai, one-to-one attention"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="otherKeywords">Other Keywords</label>
                    <input
                        className="form-control"
                        name="otherKeywords"
                        onChange={handleInputChange}
                        value={formData.otherKeywords}
                        placeholder="Eg. near Bandra, Live classes"
                    />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default SEOForWebsite;