import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
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

const SocialMediaPostContentIdeasGenerator = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();

  const getInitialFormData = () => ({
    audience: '',
    platform: 'Facebook',
    contentType: 'Single Image Post',
    topic: '',
    numberOfIdeas: '5',
  });
  const [formData, setFormData] = useState(getInitialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const promptMessage = `Generate ${formData.numberOfIdeas} social media post ideas for ${formData.audience} on ${formData.platform}. The ideas should be unique and engaging, suitable for ${formData.contentType}, and adaptable to ${formData.topic}`
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    setFormData(getInitialFormData);
  };
  return (
    <div className="generator-section">

      <h2>Social Media Post Content Ideas Generator</h2>
      <h3>Generate creative and engaging social media post ideas tailored to your target audience and chosen platform.</h3>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
          <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify your target audience, e.g., Young Adults, Professionals,  Teenagers Parents.' />
        </div>
        <div className='form-group'>
          <label htmlFor='platform'>Platform <span className='asterisk'>*</span> </label>
          <select required className='form-control' name="platform" onChange={handleInputChange} value={formData.platform}>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='contentType'> Content Type <span className='asterisk'>*</span> </label>
          <select required className='form-control' name="contentType" onChange={handleInputChange} value={formData.contentType}>
            <option value="SingleImagePost">Single Image Post</option>
            <option value="VideoPost">Video Post</option>
            <option value="TextPost">Text Post</option>
            <option value="Story">Story</option>
            <option value="Reel">Reel</option>
            <option value="Carousel">Carousel</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='topic:'>Topic <span className='asterisk'>*</span></label>
          <textarea name="topic" required className='form-control' rows={5} onChange={handleInputChange} value={formData.topic} placeholder="Describe the theme or topic, e.g., Sustainability, Technology Trends, Health Tips. If left blank, ideas will cover a variety of themes."></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='numberOfIdeas'>Number of Ideas <span className='asterisk'>*</span></label>
          <select required className='form-control' name="numberOfIdeas" onChange={handleInputChange} value={formData.numberOfIdeas}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <Button title='Generate' type="submit" />

      </form>
    </div>
  )
};
export default SocialMediaPostContentIdeasGenerator;