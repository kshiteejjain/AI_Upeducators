import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { generatorPrompt } from '../questionGeneratorSlice/QuestionGeneratorSlice';
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


const MatchQuestionsGenerator = () => {
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptMsg, setShowPromptMsg] = useState('');
  

  useEffect(() => {
    setIsLoading(loadingStatus === 'loading');
  }, [loadingStatus]);
 

  const [formData, setFormData] = useState({
    gradeLevel: 'Nursery',
    numberOfQuestions: '5',
    topic: '',
    board: 'CBSE',
    difficultyLevel: 'High'
  });


  const handleInputChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const promptMessage = `Generate  ${formData.numberOfQuestions} Match the following Questions for ${formData.gradeLevel} on ${formData.topic} for ${formData.board} board with ${formData.difficultyLevel} difficulty level. Also, provide the correct options for each question.`

      setShowPromptMsg(promptMessage);
      dispatchThunk(generatorPrompt(promptMessage));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="generator-section">
      {isLoading ? <Loader /> : null}
      <h2>Match the following Questions Generator</h2>
      <h3>Create a Match the following  assessment on any topic, grade, diagnostic assessment, and any other kind you can imagine.</h3>
      <form onSubmit={sendPrompt}>
        <div className='form-group'>
          <label htmlFor='gradeLevel'>Grade Level <span className='asterisk'>*</span> </label>
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
          <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
          <textarea name="topic" required className='form-control' rows={5} onChange={handleInputChange} value={formData.topic} placeholder="Enter the specific topic name, like 'Climate Change' or 'Trigonometry"></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='board'>Board <span className='asterisk'>*</span></label>
          <select required className='form-control' name="board" onChange={handleInputChange} value={formData.board}>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="IGCSE">IGCSE</option>
            <option value="IB">IB</option>
            <option value="State Board">State Board</option>
            <option value="Any Board">Any Board</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='difficultyLevel'>Difficulty Level <span className='asterisk'>*</span></label>
          <select required className='form-control' name="difficultyLevel" onChange={handleInputChange} value={formData.difficultyLevel}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='numberOfQuestions:'>Number of Questions:</label>
          <select required className='form-control' name="numberOfQuestions" onChange={handleInputChange} value={formData.numberOfQuestions}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <Button title='Generate' type="submit" />

        <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
      </form>
    </div>
  )
};

export default MatchQuestionsGenerator;