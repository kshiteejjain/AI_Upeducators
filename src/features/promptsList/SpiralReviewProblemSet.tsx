import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SpiralReviewProblemSet = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        mathsTopic: '',
        questionType: '',
        difficultyLevel: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a spiral review problem set with 10 ${formData.questionType} Questions for ${formData.gradeLevel} covering ${formData.mathsTopic}. The output should be generated according to the different levels of Spiral review. Also, mention the levels of spiral review and its description with each question. The questions should be ${formData.difficultyLevel} in difficulty.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Spiral Review Problem Set </h2>
            <h3>Generate a spiral review problem set to reinforce maths concepts. </h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className="asterisk">*</span></label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel} placeholder="Select the grade level for which the problem set is intended.">
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-Grade">3rd Grade</option>
                        <option value="4th-Grade">4th Grade</option>
                        <option value="5th-Grade">5th Grade</option>
                        <option value="6th-Grade">6th Grade</option>
                        <option value="7th-Grade">7th Grade</option>
                        <option value="8th-Grade">8th Grade</option>
                        <option value="9th-Grade">9th Grade</option>
                        <option value="10th-Grade">10th Grade</option>
                        <option value="11th-Grade">11th Grade</option>
                        <option value="12th-Grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="mathsTopic"> Maths Topic <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="mathsTopic"
                        onChange={handleInputChange}
                        value={formData.mathsTopic}
                        placeholder="e.g., Algebra, Geometry, Fractions"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="questionType"> Question Type <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="questionType"
                        onChange={handleInputChange}
                        value={formData.questionType}
                        placeholder="e.g., Multiple Choice, Open-Ended, Fill in the Blanks, True/False"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='difficultyLevel'> Difficulty Level </label>
                    <select className='form-control' name="difficultyLevel" onChange={handleInputChange} value={formData.difficultyLevel} placeholder="Select the difficulty level of the problems.">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default SpiralReviewProblemSet;
