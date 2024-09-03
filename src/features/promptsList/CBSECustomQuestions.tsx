import React, { useState, ChangeEvent, SyntheticEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
import BoardFormComponent from './BoardFormComponent';

const CBSECustomQuestions = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();

  const initialFormData = JSON.parse(localStorage.getItem('upEdu_prefix') || '{}');
  const [formData, setFormData] = useState({
    board: initialFormData.board || '',
    gradeLevel: initialFormData.gradeLevel || '',
    subject: initialFormData.subject || '',
    questionType: '',
    chapter: initialFormData.chapter || '',
    chapterDescription: initialFormData.chapterDescription || '',
    difficultyLevel: [] as string[],
    contextPreference: '',
    additionalDetails: '',
    topic: '',
  });

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prevData => {
        const newDifficultyLevel = checked
          ? [...prevData.difficultyLevel, value]
          : prevData.difficultyLevel.filter(item => item !== value);
        return { ...prevData, difficultyLevel: newDifficultyLevel };
      });
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  const handleChapterDescriptionChange = useCallback((description: string) => {
    setFormData(prevData => ({
      ...prevData,
      chapterDescription: description
    }));
  }, []);

  const subjectOrTopic = formData.board === 'CBSE Board' ? `${formData.subject}, ${formData.chapter}` : formData.topic;
  const checkAdditionalDetails = formData.board === 'CBSE Board' ? `The detailed outline of the unit is: ${formData.chapterDescription}` : '';

  const promptMessage = `Generate 10 ${formData.questionType} questions for ${formData.gradeLevel} on ${subjectOrTopic}. It should be framed within the context of 
  ${formData.contextPreference} at a ${formData.difficultyLevel.join(', ')} difficulty level. Also, consider these additional details: ${formData.additionalDetails}.
  ${checkAdditionalDetails}`;

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    localStorage.removeItem('upEdu_prefix'); // Remove stored data after submitting
  };

  return (
    <div className="generator-section">
      <h2>CBSE Custom Questions</h2>
      <h3>Create questions based on your Board and specific requirements.</h3>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='board'>Select Board<span className="asterisk">*</span></label>
          <select
            required
            className='form-control'
            name="board"
            onChange={handleInputChange}
            value={formData.board}>
            <option value="Any Board">Any Board</option>
            <option value="CBSE Board">CBSE Board</option>
          </select>
        </div>
        {formData.board === 'CBSE Board' ? (
          <BoardFormComponent
            gradeLevel={formData.gradeLevel}
            subject={formData.subject}
            chapter={formData.chapter}
            onInputChange={handleInputChange}
            onChapterDescriptionChange={handleChapterDescriptionChange}
          />
        ) : (
          <>
            <div className='form-group'>
              <label htmlFor='gradeLevel'>Grade Level<span className="asterisk">*</span></label>
              <select
                required
                className='form-control'
                name="gradeLevel"
                onChange={handleInputChange}
                value={formData.gradeLevel}
              >
                <option value="">Select Grade Level</option>
                {["Nursery", "Preparatory", "1st-Grade", "2nd-Grade", "3rd-Grade", "4th-Grade", "5th-Grade", "6th-Grade", "7th-Grade", "8th-Grade", "9th-Grade", "10th-Grade", "11th-Grade", "12th-Grade", "College-Level"].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='topic'>Topic / Learning Objective<span className="asterisk">*</span></label>
              <input
                required
                className="form-control"
                name="topic"
                onChange={handleInputChange}
                value={formData.topic}
                placeholder="e.g., Environmental Awareness, World War II, Algebra, Photosynthesis, Gravity"
              />
            </div>
          </>
        )}
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
          <label> Difficulty Level </label>
          <div className='checkbox-options'>
            <div className='checkbox-option'>
              <label htmlFor="easy"><input type="checkbox" id="easy" name="easy" onChange={handleInputChange} value='easy' /> Easy</label>
            </div>
            <div className='checkbox-option'>
              <label htmlFor="medium"><input type="checkbox" id="medium" name="medium" onChange={handleInputChange} value='medium' /> Medium</label>
            </div>
            <div className='checkbox-option'>
              <label htmlFor="hard"><input type="checkbox" id="hard" name="hard" onChange={handleInputChange} value='hard' /> Hard</label>
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
      <p><strong>Prompt:</strong> {promptMessage}</p>
    </div>
  );
};

export default CBSECustomQuestions;
