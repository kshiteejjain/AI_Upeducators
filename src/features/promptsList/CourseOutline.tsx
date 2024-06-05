import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const CourseOutlineGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        courseTitle: '',
        audience: '',
        courseDuration: '',
        contentDeliveryMode: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a detailed course outline for ${formData.courseTitle} Course targeted at ${formData.audience}. 
    The duration of the course is ${formData.courseDuration}. 
    Show the duration of all the modules along with the Module Title.`;
    
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Course Outline</h2>
            <h3>Create detailed outlines for academic or training courses.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='courseTitle'> Course Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='courseTitle' onChange={handleInputChange} value={formData.courseTitle} placeholder='e.g., Public Speaking, Creative Arts, Storytelling, Online Teaching' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'> Audience <span className='asterisk'>*</span></label>
                    <input type='text' className='form-control' name="audience" onChange={handleInputChange} value={formData.audience} placeholder='e.g., Students of Grades 9-10, Professionals, Educators, Kids' required />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseDuration'> Course Duration <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseDuration' onChange={handleInputChange} value={formData.courseDuration} placeholder='e.g., 10 weeks, 6 months, 1 year' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default CourseOutlineGenerator;
