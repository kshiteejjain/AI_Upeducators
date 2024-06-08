import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TeamBuildingActivity = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        groupSize: '',
        activityContext: '',
        locationPreference: '',
        ageRange: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 5 team-building activities for a group size of ${formData.groupSize}, focusing on this context:${formData.activityContext}. The activities should be appropriate for a ${formData.locationPreference} setting for ${formData.ageRange}. 
    Follow this Structure for each of the activities: ‘Activity Name’, ‘Objective’, ‘Materials Needed’, detailed and point wise 'Activity Instructions’.
    In case you want to add something else in the structure to make it better, then you can do it.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Team Building Activity</h2>
            <h3>Generate team-building activities tailored for various age ranges and settings.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="groupSize">Group Size <span className="asterisk">*</span></label>
                    <select className="form-control" name="groupSize" onChange={handleInputChange} value={formData.groupSize} required>
                        <option value="">Select the size of your group or team.</option>
                        <option value="5-10">5-10 members</option>
                        <option value="11-20">11-20 members</option>
                        <option value="21-30">21-30 members</option>
                        <option value="30+">30+ members</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="activityContext">Activity Context <span className="asterisk">*</span></label>
                    <input type="text" className="form-control" name="activityContext" onChange={handleInputChange} value={formData.activityContext} required placeholder="e.g., Beginning of the new Academic Session, Cross-Department Collaboration, Trust Building, Fun and Relaxation" />
                </div>

                <div className="form-group">
                    <label htmlFor="locationPreference">Location Preference</label>
                    <select className="form-control" name="locationPreference" onChange={handleInputChange} value={formData.locationPreference}>
                        <option value="">Indicate your preference for the location of the activity.</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Virtual">Virtual</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="ageRange">Age Range</label>
                    <input type="text" className="form-control" name="ageRange" onChange={handleInputChange} value={formData.ageRange} placeholder="e.g., Children, Teenagers, Adults, Working Professionals, Mixed Age Groups, Other" />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default TeamBuildingActivity;
