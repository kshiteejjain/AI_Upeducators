import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const MultimediaResources = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        subjectTopic: '',
        resourceType: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 3 suggestions for each resource type: ${formData.resourceType} for ${formData.gradeLevel} students. The Subject/Topic is ${formData.subjectTopic}. The resources should be engaging, informative, and tailored to the students' needs, enhancing their learning experience.
    Also, give the resource web page link with every suggestion`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Multimedia Resources</h2>
            <h3>Generate various types of resources and references such as videos, articles, images, etc.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level of your students."
                    >
                        <option value="">Select the grade level of your students.</option>
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
                        placeholder="e.g., Mathematics, Geography, Photosynthesis, World War II"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="resourceType">Resource Type <span className="asterisk">*</span></label>
                    <div>
                        <label><input type="checkbox" name="YouTube Videos" value={formData.resourceType} onChange={handleInputChange} /> YouTube Videos</label>
                        <label><input type="checkbox" name="Documentaries" value={formData.resourceType} onChange={handleInputChange} /> Documentaries</label>
                        <label><input type="checkbox" name="Demonstrations" value={formData.resourceType} onChange={handleInputChange} /> Demonstrations</label>
                        <label><input type="checkbox" name="Tutorials" value={formData.resourceType} onChange={handleInputChange} /> Tutorials</label>
                        <label><input type="checkbox" name="Movies" value={formData.resourceType} onChange={handleInputChange} /> Movies</label>
                        <label><input type="checkbox" name="Diagrams" value={formData.resourceType} onChange={handleInputChange} /> Diagrams</label>
                        <label><input type="checkbox" name="Charts" value={formData.resourceType} onChange={handleInputChange} /> Charts</label>
                        <label><input type="checkbox" name="Images" value={formData.resourceType} onChange={handleInputChange} /> Images</label>
                        <label><input type="checkbox" name="Songs" value={formData.resourceType} onChange={handleInputChange} /> Songs</label>
                        <label><input type="checkbox" name="Lectures" value={formData.resourceType} onChange={handleInputChange} /> Lectures</label>
                        <label><input type="checkbox" name="Stories" value={formData.resourceType} onChange={handleInputChange} /> Stories</label>
                        <label><input type="checkbox" name="Educational Podcasts" value={formData.resourceType} onChange={handleInputChange} /> Educational Podcasts</label>
                        <label><input type="checkbox" name="Simulations" value={formData.resourceType} onChange={handleInputChange} /> Simulations</label>
                        <label><input type="checkbox" name="Interactive Activities" value={formData.resourceType} onChange={handleInputChange} /> Interactive Activities</label>
                        <label><input type="checkbox" name="Tools" value={formData.resourceType} onChange={handleInputChange} /> Tools</label>
                        <label><input type="checkbox" name="eBooks" value={formData.resourceType} onChange={handleInputChange} /> eBooks</label>
                        <label><input type="checkbox" name="Web Pages" value={formData.resourceType} onChange={handleInputChange} /> Web Pages</label>
                        <label><input type="checkbox" name="Blogs" value={formData.resourceType} onChange={handleInputChange} /> Blogs</label>
                        <label><input type="checkbox" name="Articles" value={formData.resourceType} onChange={handleInputChange} /> Articles</label>
                        <label><input type="checkbox" name="Research Paper" value={formData.resourceType} onChange={handleInputChange} /> Research Paper</label>
                    </div>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default MultimediaResources;
