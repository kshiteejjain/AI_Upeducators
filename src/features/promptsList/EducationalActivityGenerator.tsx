import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import Loader from '../../components/loader/Loader';
import { AnyAction } from '@reduxjs/toolkit';

type GeneratorData = {
    status: string;
};

type RootState = {
    target: { name: string; value: string; };
    generatorData: GeneratorData;
    status: string;
    e: Event;
    onChange: () => void;
};

const EducationalActivityGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    
    const [formData, setFormData] = useState({
        numberOfActivities: '',
        ageGroup: 'Toddlers',
        subject: '',
        activityType: 'Interactive Game',
        learningObjective: '',
        duration: '15 minutes',
    });

    const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const sendPrompt = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const promptMessage = `Generate ${formData.numberOfActivities} educational activity for ${formData.ageGroup} on ${formData.subject} focusing on ${formData.learningObjective}. The activity type is ${formData.activityType} and should last approximately ${formData.duration}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Educational Activity Generator</h2>
            <h3>Create customized educational activities suitable for various educational settings and objectives.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='numberOfActivities'>No. of Activities <span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='numberOfActivities'
                        onChange={handleInputChange}
                        value={formData.numberOfActivities}
                        placeholder='Write the no. activities required eg. 3'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='ageGroup'>Age Group <span className='asterisk'>*</span></label>
                    <select
                        required
                        className='form-control'
                        name="ageGroup"
                        onChange={handleInputChange}
                        value={formData.ageGroup}
                    >
                        <option value="Toddlers">Toddlers</option>
                        <option value="Pre-K">Pre-K</option>
                        <option value="Kindergarten">Kindergarten</option>
                        <option value="1st Grade">1st Grade</option>
                        <option value="2nd Grade">2nd Grade</option>
                        <option value="3rd Grade">3rd Grade</option>
                        <option value="4th Grade">4th Grade</option>
                        <option value="5th Grade">5th Grade</option>
                        <option value="Middle School">Middle School</option>
                        <option value="High School">High School</option>
                        <option value="College">College</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='subject'>Subject <span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='subject'
                        onChange={handleInputChange}
                        value={formData.subject}
                        placeholder='Enter the subject for the activity (e.g., Mathematics, Science, Language Arts).'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='activityType'>Activity Type <span className='asterisk'>*</span></label>
                    <select
                        required
                        className='form-control'
                        name="activityType"
                        onChange={handleInputChange}
                        value={formData.activityType}
                    >
                        <option value="Interactive Game">Interactive Game</option>
                        <option value="Hands-On Experiment">Hands-On Experiment</option>
                        <option value="Creative Art Project">Creative Art Project</option>
                        <option value="Group Discussion">Group Discussion</option>
                        <option value="Problem-Solving Task">Problem-Solving Task</option>
                        <option value="Field Trip">Field Trip</option>
                        <option value="Game Based Activity">Game Based Activity</option>
                        <option value="Cultural and Community Activity">Cultural and Community Activity</option>
                        <option value="Reading and Research Activity">Reading and Research Activity</option>
                        <option value="Technology-Based Activities">Technology-Based Activities</option>
                        <option value="Physical Activity">Physical Activity</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='learningObjective'>Learning Objective</label>
                    <input
                        type='text'
                        className='form-control'
                        name='learningObjective'
                        onChange={handleInputChange}
                        value={formData.learningObjective}
                        placeholder='Describe the key learning objective or educational goal of this activity.'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'>Duration</label>
                    <select
                        className='form-control'
                        name="duration"
                        onChange={handleInputChange}
                        value={formData.duration}
                    >
                        <option value="15 minutes">15 minutes</option>
                        <option value="30 minutes">30 minutes</option>
                        <option value="45 minutes">45 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="Half-day">Half-day</option>
                        <option value="Full-day">Full-day</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'>Your Prompt Message: <br /><strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default EducationalActivityGenerator;
