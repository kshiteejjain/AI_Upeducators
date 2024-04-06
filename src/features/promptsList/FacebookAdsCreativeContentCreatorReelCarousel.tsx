import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookAdsCreativeContentCreatorReelCarousel = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();

  const getInitialFormData = () => ({
    contentType: 'reel',
    service: '',
    audience: ''
  });
  const [formData, setFormData] = useState(getInitialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const promptMessage = `For a Facebook ad in ${formData.contentType}, kickstart with an attention-grabbing intro for ${formData.service} to ${formData.audience}. Craft a compelling opening that sets the tone. Create engaging segments within the [content type] (autofilled) that showcase various facets or benefits of [service/skill] (autofilled). Ensure each segment tells a concise story, resonates with the audience's interests, and ends with a clear call-to-action.`
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
  };
  return (
    <div className="generator-section">
      <h2>Facebook ads creative content creator (Reel/Carousel)</h2>
      <h3>Create dynamic and visually appealing content for Facebook ad carousels and reels, tailored to captivate your audience and drive interaction.</h3>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='contentType'>Content Type <span className='asterisk'>*</span> </label>
          <select required className='form-control' name="contentType" onChange={handleInputChange} value={formData.contentType}>
            <option value="reel">Reel</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='service:'>Service/Skill <span className='asterisk'>*</span></label>
          <input name="service" required className='form-control' onChange={handleInputChange} value={formData.service} placeholder="Write your service/skill name and describe briefly" />
        </div>
        <div className='form-group'>
          <label htmlFor='audience:'>Audience <span className='asterisk'>*</span></label>
          <input name="audience" required className='form-control' onChange={handleInputChange} value={formData.audience} placeholder="Identify the target audience for your ad, such as Teenagers, College Students" />
        </div>
        <Button title='Generate' type="submit" />
      </form>
    </div>
  )
};
export default FacebookAdsCreativeContentCreatorReelCarousel;