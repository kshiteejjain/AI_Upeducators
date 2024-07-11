import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ClassNewsletterGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        classLevel: 'Nursery',
        newsletterDate: '',
        mainEvents: '',
        upcomingEvents: '',
        specialAnnouncements: '',
        studentAchievements: '',
        parentReminders: '',
        teachersNote: '',
        length: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a class newsletter for ${formData.classLevel}, dated ${formData.newsletterDate}, including main events ${formData.mainEvents}, upcoming events ${formData.upcomingEvents}, and special announcements ${formData.specialAnnouncements}. Optionally, include student achievements ${formData.studentAchievements}, parent reminders ${formData.parentReminders}. The letter should be ${formData.length}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
         <div className="generator-section">
            <h2>Class Newsletter Generator</h2>
            <h3>Create a customized newsletter for your class, highlighting recent activities, achievements, and upcoming events.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='classLevel'> Class Level<span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="classLevel" onChange={handleInputChange} value={formData.classLevel}>
                    <option value="">Select the grade level for which the project is intended.</option>
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
                <div className='form-group'>
                    <label htmlFor='newsletterDate'> Newsletter Date </label>
                    <input type="date" className='form-control' name='newsletterDate' onChange={handleInputChange} value={formData.newsletterDate} />
                </div>
                <div className='form-group'>
                    <label htmlFor='mainEvents'> Main Events<span className='asterisk'>*</span></label>
                    <input required className='form-control' name='mainEvents' onChange={handleInputChange} value={formData.mainEvents} placeholder='Briefly describe the main events or highlights since the last newsletter.' /> 
                </div>
                {/* Add more form groups for other fields (upcomingEvents, specialAnnouncements, studentAchievements, parentReminders, teachersNote, length) as needed */}
                <div className='form-group'>
                    <label htmlFor='upcomingEvents'> Upcoming Events </label>
                    <input className='form-control' name='upcomingEvents' onChange={handleInputChange} value={formData.upcomingEvents} placeholder='Provide information about any upcoming events or important dates.' /> 
                </div>
                <div className='form-group'>
                    <label htmlFor='specialAnnouncements'> Special Announcements </label>
                    <input className='form-control' name='specialAnnouncements' onChange={handleInputChange} value={formData.specialAnnouncements} placeholder='Include any special announcements or messages from the class teacher or principal.' /> 
                </div>
                <div className='form-group'>
                    <label htmlFor='studentAchievements'> Student Achievements </label>
                    <input className='form-control' name='studentAchievements' onChange={handleInputChange} value={formData.studentAchievements} placeholder='Highlight any notable achievements by students in academics, sports, or other areas.' /> 
                </div>
                <div className='form-group'>
                    <label htmlFor='parentReminders'> Parent Reminders </label>
                    <input className='form-control' name='parentReminders' onChange={handleInputChange} value={formData.parentReminders} placeholder='Add reminders or important notices for parents.' /> 
                </div> 
                <div className='form-group'>
                    <label htmlFor='teachersNote'> Teacher's Note </label>
                    <input className='form-control' name='teachersNote' onChange={handleInputChange} value={formData.teachersNote} placeholder="A section for the class teacher to share a message or reflections." /> 
                </div>
                <div className='form-group'>
                    <label htmlFor='length'> Length of the letter </label>
                    <input className='form-control' name='length' onChange={handleInputChange} value={formData.length} placeholder='Specify the desired length of the News Letter (e.g., 50 words, 100 words)' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ClassNewsletterGenerator;
