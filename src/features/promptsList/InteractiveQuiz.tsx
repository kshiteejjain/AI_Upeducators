import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const InteractiveQuiz = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        subjectTopic: '',
        questionType: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 interactive quiz questions for ${formData.gradeLevel} students on this Subject/Topic: ${formData.subjectTopic}. The question types should be ${formData.questionType}.  
    Add relevant Interactive Elements for example- Images, Videos, Audio Clips, Interactive Diagrams, Graphs, etc for every question. 
    Provide the answer, Interactive Elements, and Immediate Feedback after every question.
    If there is more than one type of question then create an equal number of questions for each type. 
    For Example- 
    If the question types are Multiple Choice, True/False, Riddle, Crossword and Short Answer then create 2 questions for each of the types i.e., Multiple Choice, True/False, Riddle, Crossword, and Short Answer`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Interactive Quiz</h2>
            <h3>Create an interactive quiz for students on any topic.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which the quiz is intended."
                    >
                        <option value="">Select the grade level for which the quiz is intended.</option>
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
                    <label htmlFor="subjectTopic">Subject/Topic <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="subjectTopic"
                        onChange={handleInputChange}
                        value={formData.subjectTopic}
                        placeholder="e.g., Mathematics, General Knowledge, World War II, Indian Sports"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='questionType'>Question Type</label>
                    <div className="checkbox-options">
                        {["Multiple Choice", "True/False", "Short Answer", "Fill in the Blanks", "Puzzle or Riddle", "Crossword or Word Search", "Rapid-Fire", "Bonus or Tiebreaker"].map(type => (
                            <div key={type} className="checkbox-option">
                                <input
                                    type="checkbox"
                                    name={type}
                                    value={type}
                                    checked={formData.questionType === type}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor={type}>{type}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default InteractiveQuiz;
