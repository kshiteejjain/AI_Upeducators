import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const MathematicsSolutions  = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        problemStatement: '',
    });
    const [formData, setFormData] = useState(getInitialFormData );
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a solution for the mathematics problem stated: ${formData.problemStatement} The solution should be in two versions, one in detail and another in short`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Mathematics Solutions</h2>
            <h3>Generate solutions for mathematics problems.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='assignmentType'>Problem Statement <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name="problemStatement" onChange={handleInputChange} value={formData.problemStatement} rows={5} placeholder='Enter the full statement of the mathematics problem that needs a solution.'> </textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default MathematicsSolutions;
