import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookAdsCreativeContentCreatorImage = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch()
 
  const [formData, setFormData] = useState({
    service: '',
    audience: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const promptMessage = `Generate compelling text for a single image ad promoting ${formData.service} to ${formData.audience}. Then craft an impactful caption that encapsulates the key benefit or unique selling point of ${formData.service}. Ensure the text is visually appealing and complements the image. Aim for clarity, captivation, and relevance to the audience's interests.`
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
  };

  return (
    <div className="generator-section">
      <h2>Facebook ads creative content creator (Image)</h2>
      <h3>Design striking single-image content for Facebook ads with engaging text to grab the attention of your audience.</h3>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='service:'>Service/Skill <span className='asterisk'>*</span></label>
          <input name="service" required className='form-control' onChange={handleInputChange} value={formData.service} placeholder="Write your service/skill name and describe briefly" />
        </div>
        <div className='form-group'>
          <label htmlFor='audience:'>Audience <span className='asterisk'>*</span></label>
          <input name="audience" required className='form-control' onChange={handleInputChange} value={formData.audience} placeholder="Identify the target audience for your ad, such as Teenagers, College Students." />
        </div>
        <Button title='Generate' type="submit" />
      </form>
    </div>
  )
};
export default FacebookAdsCreativeContentCreatorImage;