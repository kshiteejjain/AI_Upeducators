import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
import boardWiseData from '../../utils/BoardWiseForms.json';

type ChapterData = {
    [chapterName: string]: string; // assuming each chapter's data is just a string, adjust if the structure is different
};

type SubjectData = {
    [subjectName: string]: ChapterData;
};

type GradeData = {
    [gradeLevel: string]: SubjectData;
};

type BoardForms = {
    CBSEForms: GradeData;
};



const CBSECustomQuestions = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        gradeLevel: '',
        subject: '',
        questionType: '',
        chapter: '',
        difficultyLevel: [] as string[],
        contextPreference: '',
        additionalDetails: '',
    });

    const [formData, setFormData] = useState(getInitialFormData);
    const [boardWiseSelectedData, setBoardWiseSelectedData] = useState('');
    const [promptMessageView, setPromptMessageView] = useState("")
    
    const fetchBoardData = () => {
        const chapterData = boardWiseData?.CBSEForms?.[formData.gradeLevel]?.[formData.subject]?.[formData.chapter];
    
        if (chapterData) {
            // If chapterData exists, check its type and handle accordingly
            setBoardWiseSelectedData(typeof chapterData === 'string' ? chapterData : (chapterData.someProperty || 'Default info if property is missing'));
            console.log("Fetched Board Data:", chapterData);
        } else {
            // If chapterData does not exist, return a default string
            setBoardWiseSelectedData('No data found for the selected criteria.');
        }
    };
    

    

    useEffect(() => {
        if (formData.gradeLevel && formData.subject && formData.chapter) {
            fetchBoardData();
        }
    }, [formData.gradeLevel, formData.subject, formData.chapter]); 

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            if (checkbox.checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    difficultyLevel: [...prevData.difficultyLevel, value]
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    difficultyLevel: prevData.difficultyLevel.filter((item) => item !== value)
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };


    const promptMessage = `Generate 10 ${formData.questionType} questions for ${formData.gradeLevel} on ${formData.chapter}.
    Refer to this Chapter outline for generating the output:
    
    ${boardWiseSelectedData}
    
    The questions should be framed within the context of ${formData.contextPreference} at a ${formData.difficultyLevel.join(', ')} difficulty level. 
    Also, consider these additional details: ${formData.additionalDetails}.
    `;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setPromptMessageView(promptMessage)
    };

    return (
        <div className="generator-section">
            <h2>CBSE Custom Questions</h2>
            <h3>Create questions based on your Board and specific requirements.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which the questions are being created">
                        <option value="">Select the grade</option>
                        <option value="6th-Grade">6th Grade</option>
                        <option value="7th-Grade">7th Grade</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='subject'>Subject
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="subject"
                        onChange={handleInputChange}
                        value={formData.subject}
                        placeholder="Select Subject">
                        <option value="">Select the subject</option>
                        <option value="Science">Science</option>
                        <option value="Mathematics">Mathematics</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='questionType'>Question Type</label>
                    <input
                        className='form-control'
                        name="questionType"
                        onChange={handleInputChange}
                        value={formData.questionType}
                        placeholder="Multiple Choice, True/False, Short Answer, Essay, Fill in the Blanks, Match the Following" />
                </div>

                <div className='form-group'>
                    <label htmlFor='chapter'>Chapter
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="chapter"
                        onChange={handleInputChange}
                        value={formData.chapter}
                        placeholder="Select the relevant chapter name">
                        <option value="">Select the chapter</option>
                        <option value="Chapter 1">Chapter 1</option>
                        <option value="Chapter 2">Chapter 2</option>
                        <option value="Chapter 3">Chapter 3</option>
                        <option value="Chapter 4">Chapter 4</option>
                        <option value="Chapter 5">Chapter 5</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label> Difficulty Level </label>
                    <div className='checkbox-options'>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="easy" name="easy" onChange={handleInputChange} value='easy' />
                            <label htmlFor="easy">Easy</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="medium" name="medium" onChange={handleInputChange} value='medium' />
                            <label htmlFor="medium">Medium</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="hard" name="hard" onChange={handleInputChange} value='hard' />
                            <label htmlFor="hard">Hard</label>
                        </div>
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='contextPreference'>Context Preference</label>
                        <input
                        className='form-control'
                        name="contextPreference"
                        onChange={handleInputChange}
                        value={formData.contextPreference}
                        placeholder="Mention the context or theme in which you prefer the questions to be framed (e.g., Cricket, Harry Potter, Space Exploration)" />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                        <input
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="e.g., word limit for essay questions, structure for multiple-choice options, any specific requirement" />
                </div>

                <Button title='Generate' type="submit" />

            </form>
            <p><strong>Prompt:</strong> {promptMessageView}</p>
        </div>
    )
};
export default CBSECustomQuestions;
