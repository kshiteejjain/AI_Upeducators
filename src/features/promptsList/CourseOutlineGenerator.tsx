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
    const promptMessage = `Create a detailed course outline for ${formData.courseTitle} targeted at ${formData.audience}. The duration of the course is ${formData.courseDuration} and the content will be delivered through ${formData.contentDeliveryMode} mode. Follow this structure in the output: Course title, Course Duration, Delivery Method, Course Description, Learning Outcomes, Course Schedule (detailed description of modules along with module title), Assessment Strategies, Resources/Course Materials. Show the duration of all the modules along with the module title.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Course Outline Generator</h2>
            <h3>This tool assists in creating detailed outlines for academic or training courses, planning course content and delivery.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='courseTitle'> Course Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='courseTitle' onChange={handleInputChange} value={formData.courseTitle} placeholder='Enter the title of the course.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'> Audience </label>
                    <select className='form-control' name="audience" onChange={handleInputChange} value={formData.audience}>
                        <option value="General">General</option>
                        <option value="Students">Students</option>
                        <option value="Professionals">Professionals</option>
                        <option value="Educators">Educators</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='courseDuration'> Course Duration <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseDuration' onChange={handleInputChange} value={formData.courseDuration} placeholder='Specify the total duration of the course (e.g., 10 weeks, 6 months).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='contentDeliveryMode'> Content Delivery Mode <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="contentDeliveryMode" onChange={handleInputChange} value={formData.contentDeliveryMode}>
                        <option value="Online">Online</option>
                        <option value="In-person">In-person</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Self-paced">Self-paced</option>
                        <option value="Instructor-led">Instructor-led</option>
                    </select>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default CourseOutlineGenerator;
