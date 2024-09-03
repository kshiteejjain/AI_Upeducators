import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WordSearch = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        subject:'',
        numberOfWords: '',
        difficultyLevel:'',
        gridSize: '',

    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a Word Search game for students of Grade ${formData.gradeLevel} on ${formData.subject} with ${formData.numberOfWords} words at ${formData.difficultyLevel} difficulty. The grid size should be ${formData.gridSize} and it should match the cognitive skills of the targeted grade level. Also note, when you start the table write ‘StartTable’ in the beginning and when you end the table immediately after it ends write ‘EndTable. "Add Words to find after the "EndTable". give me data table format which has table and rest data in richText, keep each character in separate column`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Word Search</h2>
            <h3>Create a custom Word Search game.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                    >
                        <option value="">Select the grade level for which the Word Search game is intended.</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st Grade">1st Grade</option>
                        <option value="2nd Grade">2nd Grade</option>
                        <option value="3rd Grade">3rd Grade</option>
                        <option value="4th Grade">4th Grade</option>
                        <option value="5th Grade">5th Grade</option>
                        <option value="6th Grade">6th Grade</option>
                        <option value="7th Grade">7th Grade</option>
                        <option value="8th Grade">8th Grade</option>
                        <option value="9th Grade">9th Grade</option>
                        <option value="10th Grade">10th Grade</option>
                        <option value="11th Grade">11th Grade</option>
                        <option value="12th Grade">12th Grade</option>
                        <option value="College Level">College Level</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="subject"
                        onChange={handleInputChange}
                        value={formData.subject}
                        placeholder="e.g., Vocabulary, Science, Historical figures, Indian Landscapes"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="numberOfWords">Number of Words<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="numberOfWords"
                        onChange={handleInputChange}
                        value={formData.numberOfWords}
                    >
                        <option value="">Choose how many words should be included in the Word Search game.</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="difficultyLevel">Difficulty Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="difficultyLevel"
                        onChange={handleInputChange}
                        value={formData.difficultyLevel}
                    >
                        <option value="">Select the difficulty level of the Word Search game.</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="gridSize">Grid Size<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gridSize"
                        onChange={handleInputChange}
                        value={formData.gridSize}
                    >
                        <option value="">Choose the size of the Word Search grid based on the number of words and difficulty level.</option>
                        <option value="Small (10x10)">Small (10x10)</option>
                        <option value="Medium (15x15)">Medium (15x15)</option>
                        <option value="Large (20x20)">Large (20x20)</option>
                    </select>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WordSearch;