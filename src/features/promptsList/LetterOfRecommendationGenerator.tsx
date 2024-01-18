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

const LetterOfRecommendationGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        recommenderName: '',
        recommenderPosition: '',
        recommenderInstitution: '',
        candidateName: '',
        relationshipToCandidate: '',
        candidateQualities: '',
        specificExamples: '',
        purposeOfRecommendation: '',
        length: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            const promptMessage = `I am ${formData.recommenderName}, ${formData.recommenderPosition}, ${formData.recommenderInstitution}. Generate a personalized Letter of Recommendation for ${formData.candidateName}. I am his/her ${formData.relationshipToCandidate}. Candidate qualities are ${formData.candidateQualities}, some of the candidate achievements and abilities are ${formData.specificExamples}. Purpose of recommendation is ${formData.purposeOfRecommendation}. The letter of recommendation should be within ${formData.length}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Letter of Recommendation Generator</h2>
            <h3>Create a personalized and professional Letter of Recommendation.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='recommenderName'> Recommender's Name <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='recommenderName' onChange={handleInputChange} value={formData.recommenderName} placeholder='Enter your full name.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='recommenderPosition'>Recommender's Position/Title <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='recommenderPosition' onChange={handleInputChange} value={formData.recommenderPosition} placeholder='Enter your current position or title (e.g., Professor, Manager).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='recommenderInstitution'>Recommender's Institution/Organization <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='recommenderInstitution' onChange={handleInputChange} value={formData.recommenderInstitution} placeholder='Enter the name of your institution or organization.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='candidateName'> Candidate's Name <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='candidateName' onChange={handleInputChange} value={formData.candidateName} placeholder='Enter the full name of the person you are recommending.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='relationshipToCandidate'>Relationship to Candidate <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='relationshipToCandidate' onChange={handleInputChange} value={formData.relationshipToCandidate} placeholder='Describe your relationship to the candidate (e.g., teacher, supervisor).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='candidateQualities'> Candidate's Qualities <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='candidateQualities' onChange={handleInputChange} rows={5} value={formData.candidateQualities} placeholder='List key qualities, skills, and achievements of the candidate.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='specificExamples'> Specific Examples <span className='asterisk'>*</span> </label>
                    <textarea required className='form-control' name='specificExamples' onChange={handleInputChange} rows={5} value={formData.specificExamples} placeholder='Provide specific examples that demonstrate the candidate"s abilities and achievements.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='purposeOfRecommendation'> Purpose of Recommendation <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='purposeOfRecommendation' onChange={handleInputChange} value={formData.purposeOfRecommendation} placeholder='State the purpose of the recommendation (e.g., job application, academic admission).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='length'> Length of the Letter </label>
                    <input className='form-control' name='length' onChange={handleInputChange} value={formData.length} placeholder='Specify the desired length of the Letter (e.g., 50 words, 100 words).' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default LetterOfRecommendationGenerator;
