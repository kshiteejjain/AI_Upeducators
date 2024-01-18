import React, { useEffect, useState, ChangeEvent } from 'react';
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

const SyllabusGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        courseName: '',
        gradeLevel: 'Nursery',
        educationalBoard: 'CBSE',
        courseDuration: '',
        mainTopics: '',
        learningObjectives: '',
        assessmentMethods: '',
        additionalResources: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const sendPrompt = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const promptMessage = `Generate a syllabus for the course "${formData.courseName}" for ${formData.gradeLevel} under the ${formData.educationalBoard}. The course duration is ${formData.courseDuration}. Main topics include: ${formData.mainTopics}. Learning objectives: ${formData.learningObjectives}. Assessment methods: ${formData.assessmentMethods}. Additional resources: ${formData.additionalResources}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Syllabus Generator</h2>
            <h3>This tool assists in creating detailed syllabi for various courses and subjects.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='courseName'> Course Name <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='courseName' onChange={handleInputChange} value={formData.courseName} placeholder='Enter the name of the course (e.g., Introduction to Biology, Advanced Mathematics).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
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
                <div className='form-group'>
                    <label htmlFor='educationalBoard'> Educational Board <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="educationalBoard" onChange={handleInputChange} value={formData.educationalBoard}>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="IGCSE">IGCSE</option>
                        <option value="IB">IB</option>
                        <option value="State Board">State Board</option>
                        <option value="Any Board">Any Board</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='courseDuration'> Course Duration <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseDuration' onChange={handleInputChange} value={formData.courseDuration} placeholder='Specify the duration of the course (e.g., 10 weeks, one semester, one year).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='mainTopics'> Main Topics <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='mainTopics' onChange={handleInputChange} rows={5} value={formData.mainTopics} placeholder='List the main topics to be covered in the course.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='learningObjectives'> Learning Objectives </label>
                    <textarea className='form-control' name='learningObjectives' onChange={handleInputChange} rows={5} value={formData.learningObjectives} placeholder='Describe the key learning objectives for the course.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='assessmentMethods'> Assessment Methods </label>
                    <textarea className='form-control' name='assessmentMethods' onChange={handleInputChange} rows={5} value={formData.assessmentMethods} placeholder='Detail the methods of assessment (e.g., quizzes, assignments, exams).'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalResources'> Additional Resources </label>
                    <textarea className='form-control' name='additionalResources' onChange={handleInputChange} rows={5} value={formData.additionalResources} placeholder='Include any additional resources (e.g., textbooks, websites, software).'> </textarea>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default SyllabusGenerator;
