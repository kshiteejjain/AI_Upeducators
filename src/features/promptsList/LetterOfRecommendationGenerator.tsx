import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const LetterOfRecommendationGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
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
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
const promptMessage = `I am ${formData.recommenderName}, ${formData.recommenderPosition}, ${formData.recommenderInstitution}. Generate a personalized Letter of Recommendation for ${formData.candidateName}. I am his/her ${formData.relationshipToCandidate}. Candidate qualities are ${formData.candidateQualities}, some of the candidate achievements and abilities are ${formData.specificExamples}. Purpose of recommendation is ${formData.purposeOfRecommendation}. The letter of recommendation should be within ${formData.length}.`;
const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    setFormData(getInitialFormData);
};
return (
    <div className="generator-section">
        <h2>Letter of Recommendation Generator</h2>
        <h3>Create a personalized and professional Letter of Recommendation.</h3>
        <form onSubmit={handleSubmit}>
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
        </form>
    </div>
)
};
export default LetterOfRecommendationGenerator;
