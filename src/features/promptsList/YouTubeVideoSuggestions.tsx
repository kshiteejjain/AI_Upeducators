import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const YouTubeVideoSuggestions = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicSubject: '',
        videoLength: '',
        additionalCriteria: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a list of 5 YouTube video suggestions for ${formData.gradeLevel} students on the subject/topic of ${formData.topicSubject}. The videos should be ${formData.videoLength} in length and serve as educational resources that can complement lessons or assignments.
    Consider these additional criteria: ${formData.additionalCriteria}.
    Also, mention the resource URL with every suggestion.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>YouTube Video Suggestions</h2>
            <h3>Generate a curated list of YouTube video suggestions on specific topics.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the educational level the videos are intended for."
                    >
                        <option value="">Select the educational level the videos are intended for.</option>
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
                    <label htmlFor="topicSubject">Topic/Subject<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topicSubject"
                        onChange={handleInputChange}
                        value={formData.topicSubject}
                        placeholder="Photosynthesis, World War II, Geography, History"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="videoLength">Video Length</label>
                    <select
                        className="form-control"
                        name="videoLength"
                        onChange={handleInputChange}
                        value={formData.videoLength}
                        placeholder="Select preferred video length."
                    >
                        <option value="">Select preferred video length.</option>
                        <option value="Any">Any</option>
                        <option value="Short">Short (less than 4 minutes)</option>
                        <option value="Medium">Medium (4-20 minutes)</option>
                        <option value="Long">Long (grater than 20 minutes)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="additionalCriteria">Additional Criteria</label>
                    <textarea
                        className="form-control"
                        name="additionalCriteria"
                        onChange={handleInputChange}
                        value={formData.additionalCriteria}
                        placeholder="For Example- Upload Date (e.g., Today, This Week, This Month) Type (e.g., Channel, Playlist, Film) Features (e.g., Live, HD, 3D) View Count (e.g., More than 1 Million Views)"
                        rows={5}
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default YouTubeVideoSuggestions;
