import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const BloomsTaxonomy = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        bloomsTaxonomyLevels: '',
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
    const promptMessage = `Generate 10 ${formData.questionTypes} questions for ${formData.gradeLevel} on the topic ${formData.topic}. It should focus on ${formData.gradeLevel} levels of Bloom's Taxonomy. Ensure the questions are appropriate for the educational level and taxonomy stages selected. Also show the selected level i.e., ${formData.gradeLevel} with each question. `;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Bloom's Taxonomy</h2>
            <h3> Generate questions as per Bloom's Taxonomy.</h3>
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
                    <label htmlFor='bloomsTaxonomyLevels'> Bloom's Taxonomy Levels
                        <span className="asterisk">*</span></label>
                    <div className='checkbox-group'>
                        <label>
                            <input
                                type='checkbox'
                                name='Remembering'
                                value={formData.bloomsTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Remembering
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Understanding'
                                value={formData.bloomsTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Understanding
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='v'
                                value={formData.bloomsTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Applying
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Analyzing'
                                value={formData.bloomsTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Analyzing
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Evaluating'
                                value={formData.bloomsTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Evaluating
                        </label>
                        <label>
                            <input
                                type='checkbox'
                                name='Creating'
                                value={formData.bloomsTaxonomyLevels}
                                onChange={handleInputChange}
                            /> Creating
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
export default BloomsTaxonomy;
