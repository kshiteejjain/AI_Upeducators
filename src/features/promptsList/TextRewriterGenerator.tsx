import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextRewriterGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        originalText: '',
        desiredTone: 'Academic',
        textLength: '200',
        targetAudience: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Rewrite the following text: "${formData.originalText}". The rewritten text should have a "${formData.desiredTone}" tone, be "${formData.textLength}" words in length, tailored for "${formData.targetAudience}".`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Text Rewriter Generator</h2>
            <h3>Create a tool to rephrase or rewrite given text in a more engaging, simplified, or formal tone while maintaining the original meaning.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='originalText'>Original Text <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='originalText' onChange={handleInputChange} rows={5} value={formData.originalText} placeholder='Enter the text you want to rewrite.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='desiredTone'>Desired Tone <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="desiredTone" onChange={handleInputChange} value={formData.desiredTone}>
                        <option value="Academic">Academic</option>
                        <option value="Informal">Informal</option>
                        <option value="Business">Business</option>
                        <option value="Creative">Creative</option>
                        <option value="Simplified">Simplified</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='textLength'>Text Length (no. of Words) <span className='asterisk'>*</span></label>
                    <input type='text' className='form-control' name='textLength' onChange={handleInputChange} value={formData.textLength} placeholder='200' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience</label>
                    <input type='text' className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the audience (e.g., Class 9th students, Educators).' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default TextRewriterGenerator;
