import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FunnelMarketingIdeas = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();
  const getInitialFormData = () => ({
    courseSkillName: '',
    audience: '',
  });
  const [formData, setFormData] = useState(getInitialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const promptMessage = `Pls develop the funnel marketing ideas to promote ${formData.courseSkillName} to the ${formData.audience} using facebook and instagram ads. Pls show 3 funnel stage i.e. awareness, consideration and conversion, show 2 ideas for every stage and also add the targeting options for every stage, not for every ideas. If you are giving multiple targeting options in a stage, write if we have to use all targeting options in 1 ad or what to do. show facebook ads objective name for each idea. Also add a tip in every stage so that every stage gets inter connected or dependent as it should actually do`
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('isGPT4', 'true');
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    
  };
  return (
    <div className="generator-section">

      <h2>Funnel Marketing Ideas</h2>
      <h3>Generate Funnel marketing ideas for Facebook ad.</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="courseSkillName">Course/Skill name <span className="asterisk">*</span></label>
          <input
            required
            type="text"
            className="form-control"
            name="courseSkillName"
            onChange={handleInputChange}
            value={formData.courseSkillName}
            placeholder="Eg. yoga classes for kids, dance classes"
          />
        </div>

        <div className="form-group">
          <label htmlFor="audience">Audience <span className="asterisk">*</span></label>
          <input
            required
            type="text"
            className="form-control"
            name="audience"
            onChange={handleInputChange}
            value={formData.audience}
            placeholder="Eg. Parents, Professionals"
          />
        </div>
        <Button title='Generate' type="submit" />

      </form>
    </div>
  )
};
export default FunnelMarketingIdeas;