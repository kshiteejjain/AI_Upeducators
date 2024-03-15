import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SoloTaxonomy = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        SoloTaxonomyLevels: '',
        questionTypes: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 ${formData.questionTypes} questions for ${formData.gradeLevel} on the topic ${formData.topic}. It should focus on ${formData.SoloTaxonomyLevels} levels of SOLO Taxonomy. Ensure the questions are appropriate for the educational level and taxonomy stages selected. Also show the selected level i.e., ${formData.SoloTaxonomyLevels} with each question.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>SOLO Taxonomy</h2>
            <h3> Create questions based on SOLO Taxonomy.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}>
                        <option value="">Select the grade level for the questions</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-grade">3rd Grade</option>
                        <option value="4th-grade">4th Grade</option>
                        <option value="5th-grade">5th Grade</option>
                        <option value="6th-grade">6th Grade</option>
                        <option value="7th-grade">7th Grade</option>
                        <option value="8th-grade">8th Grade</option>
                        <option value="9th-grade">9th Grade</option>
                        <option value="10th-grade">10th Grade</option>
                        <option value="11th-grade">11th Grade</option>
                        <option value="12th-grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>


                <div className="form-group">
                    <label htmlFor="topic"> Topic
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., Algebra, World War II, Digestive System, Simple Machines"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='soloTaxonomyLevels'> SOLO Taxonomy Levels
                        <span className="asterisk">*</span></label>
                    <div className='checkbox-group'>
                        <label>
                            <input
                                type='checkbox'
                                name='Pre-structural'
                                value={formData.SoloTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Pre-structural
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Uni-structural'
                                value={formData.SoloTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Uni-structural
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Multi-structural'
                                value={formData.SoloTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Multi-structural
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Relational'
                                value={formData.SoloTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Relational
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Extended Abstract'
                                value={formData.SoloTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Extended Abstract
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="questionTypes"> Question Types
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="questionTypes"
                        onChange={handleInputChange}
                        value={formData.questionTypes}
                        placeholder="eg., Multiple Choice, Open-Ended, True/False, Fill in the Blanks"
                    />
                </div>

                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default SoloTaxonomy;
