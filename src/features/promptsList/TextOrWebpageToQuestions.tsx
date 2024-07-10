import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextWebPageSummarizer = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        textURLToSummarize:'',
        summaryLength: '',
        outputType: '',
        questionType: '',
        otherQuestionType: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);
    const [isOtherQuestionType, setIsOtherQuestionType] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'radio' && name === 'questionType') {
            setFormData((prevData) => ({
                ...prevData,
                questionType: value,
                otherQuestionType: value === 'Other' ? '' : prevData.otherQuestionType
            }));
            setIsOtherQuestionType(value === 'Other');
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const promptMessage = `Generate a ${formData.outputType} summary of the following text or link: ${formData.textURLToSummarize}. The summary should be approximately ${formData.summaryLength} in length. Use the ${isOtherQuestionType ? formData.otherQuestionType : formData.questionType} approach for summarization.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Text or Webpage to Questions</h2>
            <h3>Summarize any text or web page in a concise format.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="textURLToSummarize"> Text Input / URL<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="textURLToSummarize"
                        onChange={handleInputChange}
                        value={formData.textURLToSummarize}
                        rows={5}
                        placeholder="Paste the text or URL you want to summarize."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="summaryLength"> Summary Length<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="summaryLength"
                        type="text"
                        onChange={handleInputChange}
                        value={formData.summaryLength}
                        placeholder="e.g., 100 words, 150 words, 200 words"
                    />
                </div>

                <div className="form-group">
                    <label> Output Type<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="outputType"
                        onChange={handleInputChange}
                        value={formData.outputType}>
                        <option value="">Select One</option>
                        <option value="Paragraph-style">Paragraph-style</option>
                        <option value="Bullet point">Bullet point</option>
                    </select>
                </div>

                <div className="form-group">
                    <label> Question Type<span className="asterisk">*</span></label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="questionType"
                                value="Multiple Choice"
                                onChange={handleInputChange}
                                checked={formData.questionType === 'Multiple Choice'}
                            /> Multiple Choice
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="questionType"
                                value="Fill in the blanks"
                                onChange={handleInputChange}
                                checked={formData.questionType === 'Fill in the blanks'}
                            /> Fill in the blanks
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="questionType"
                                value="True/False"
                                onChange={handleInputChange}
                                checked={formData.questionType === 'True/False'}
                            /> True/False
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="questionType"
                                value="Comprehension"
                                onChange={handleInputChange}
                                checked={formData.questionType === 'Comprehension'}
                            /> Comprehension
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="questionType"
                                value="Open-Ended"
                                onChange={handleInputChange}
                                checked={formData.questionType === 'Open-Ended'}
                            /> Open-Ended
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="questionType"
                                value="Essay"
                                onChange={handleInputChange}
                                checked={formData.questionType === 'Essay'}
                            /> Essay
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="questionType"
                                value="Other"
                                onChange={handleInputChange}
                                checked={formData.questionType === 'Other'}
                            /> Other
                        </label>
                    </div>
                </div>

                {isOtherQuestionType && (
                    <div className="form-group">
                        <label htmlFor="otherQuestionType"> Other Question Type </label>
                        <input
                            className="form-control"
                            name="otherQuestionType"
                            onChange={handleInputChange}
                            value={formData.otherQuestionType}
                            placeholder="Specify other question type"
                        />
                    </div>
                )}

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};

export default TextWebPageSummarizer;
