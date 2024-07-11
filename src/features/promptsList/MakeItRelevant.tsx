import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const MakeItRelevant = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        describeStudents: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 5 ideas to make the topic of ${formData.topic} more relevant and engaging for ${formData.gradeLevel} students. Consider this additional information about students to tailor the ideas: ${formData.describeStudents}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Make It Relevant!</h2>
            <h3>Generate ideas to make your teaching content relevant by considering the interests and backgrounds of your students.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level<span className="asterisk">*</span> </label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="" disabled selected>Select the grade level of your class</option>
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

                <div className='form-group'>
                    <label htmlFor='topic'> Topic<span className="asterisk">*</span> </label>
                    <input
                        required
                        className='form-control'
                        name='topic'
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., Algebra, World History, Solar System, Environmental Science"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='describeStudents'> Describe your students<span className="asterisk">*</span> </label>
                    <textarea
                        required
                        className='form-control'
                        name='describeStudents'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.describeStudents}
                        placeholder='e.g., Interests, Hobbies, Background, Learning Styles.'>
                    </textarea>
                </div>


                <Button title="Generate" type="submit" />
            </form>
        </div>
    );
};
export default MakeItRelevant;
