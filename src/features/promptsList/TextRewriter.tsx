import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const CustomTextRewriter = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        originalText: '',
        criteriaRewriting: '',
        lengthRewrittenText: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Rewrite the following text: ${formData.originalText}. 
    The re-written text should ${formData.criteriaRewriting} and ${formData.lengthRewrittenText} in length.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Text Rewriter</h2>
            <h3>Transform any given text according to specific requirements.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='originalText'> Original Text <span className="asterisk">*</span> </label>
                    <textarea
                        required
                        className='form-control'
                        name='originalText'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.originalText}
                        placeholder='Enter the text you want to rewrite.'>
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='criteriaRewriting'> Criteria for Rewriting <span className="asterisk">*</span> </label>
                    <textarea
                        required
                        className='form-control'
                        name='criteriaRewriting'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.criteriaRewriting}
                        placeholder='Simplify for Understanding, Enhance the content, Adapt for Different Grade Levels, Make More Engaging'>
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='lengthRewrittenText'> Length of Rewritten Text <span className="asterisk">*</span> </label>
                    <select required className='form-control' name="lengthRewrittenText" onChange={handleInputChange} value={formData.lengthRewrittenText}>
                        <option value="" disabled selected>Choose the length of the rewritten text</option>
                        <option value="Original-Word-Count">Original Word Count</option>
                        <option value="Shorten-by-25%">Shorten by 25%</option>
                        <option value="Shorten-by-50%">Shorten by 50%</option>
                        <option value="Extend-by-25%">Extend by 25%</option>
                        <option value="Extend-by-50%">Extend by 50%</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default CustomTextRewriter;
