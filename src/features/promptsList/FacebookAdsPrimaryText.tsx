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

const FacebookAdsPrimaryTextGenerator = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();
  const getInitialFormData = () => ({
    facebookAdHeadline: '',
    audience: ''
  });

  const [formData, setFormData] = useState(getInitialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const promptMessage = `Generate engaging primary text for a Facebook ad whose headline is ${formData.facebookAdHeadline} and audience is ${formData.audience}. Craft a concise yet compelling message that highlights the key benefits or unique selling points. Create a sense of urgency or curiosity, include a clear call-to-action, and ensure the content resonates with the interests or needs of the target audience.
  `
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    setFormData(getInitialFormData);
  };
  return (
    <div className="generator-section">
      <h2>Facebook Ads Primary Text</h2>
      <h3>Craft primary text for Facebook ads, designed to resonate with your audience</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="facebookAdHeadline"> Headline of your Facebook ad <span className="asterisk">*</span></label>
          <input
            required
            className="form-control"
            name="facebookAdHeadline"
            onChange={handleInputChange}
            value={formData.facebookAdHeadline}
            placeholder="Eg. Ignite Your Child's Passion for Dance with Professional Classes"
          />
        </div>

        <div className="form-group">
          <label htmlFor="audience"> Audience <span className="asterisk">*</span></label>
          <input
            required
            className="form-control"
            name="audience"
            onChange={handleInputChange}
            value={formData.audience}
            placeholder="Eg. Teenagers, College Students."
          />
        </div>

        <Button title='Generate' type="submit" />

      </form>
    </div>
  )
};
export default FacebookAdsPrimaryTextGenerator;