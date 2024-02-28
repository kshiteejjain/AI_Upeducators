import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EmailContentGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        courseName: '',
        targetAudience: '',
        courseDuration: 'one Month',
        courseFormat: 'online',
        keyTopics: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a detailed description of the benefits of the course named ${formData.courseName} targeted towards ${formData.targetAudience} The course, which lasts for ${formData.courseDuration} and is offered in a ${formData.courseFormat} format, covers key topics such as ${formData.keyTopics}. This description should highlight how the course will be advantageous for the learners and what unique opportunities it offers.            `
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Course Benefits Generator</h2>
            <h3>Generate a detailed description of the benefits of a particular course, tailored for prospective students or educators.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='courseName'>Course Name <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseName' onChange={handleInputChange} value={formData.courseName} placeholder='Enter the name of the course, e.g., "Advanced Mathematics" or "Introduction to Programming' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the target audience for the course, such as high school students, college students, professionals, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseDuration'>Course Duration <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="courseDuration" onChange={handleInputChange} value={formData.courseDuration}>
                        <option value="oneMonth">1 month </option>
                        <option value="twoMonths">3 months </option>
                        <option value="threeMonths">6 months </option>
                        <option value="twelveMonths">12 months</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='courseFormat'> Course Format <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="courseFormat" onChange={handleInputChange} value={formData.courseFormat}>
                        <option value="online">Online </option>
                        <option value="offline">Offline </option>
                        <option value="hybrid">Hybrid </option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keyTopics'>Key Topics <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='keyTopics' onChange={handleInputChange} value={formData.keyTopics} placeholder='List the main topics covered in the course, separated by commas.' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default EmailContentGenerator;