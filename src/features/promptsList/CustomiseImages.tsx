import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/ImageGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
type ImageGeneratorData = {
  status: string;
};
type RootState = {
  target: { name: string; value: string; };
  generatorData: ImageGeneratorData;
  status: string;
  e: Event;
  onChange: () => void;
};

const CustomiseImages = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(loadingStatus === 'loading');
  }, [loadingStatus]);

  const [formData, setFormData] = useState({
    defineTheImage: '',
    style: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const promptMessage = `Generate an image using this description: ${formData.defineTheImage}.
  The image should be in this style: ${formData.style}.`;
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
  };

  return (
    <div className="generator-section">

      <h2>Customise Images</h2>
      <h3>Generate customized images on any given topic.</h3>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="defineTheImage">Define the Image<span className="asterisk">*</span></label>
          <textarea
            required
            className="form-control"
            name="defineTheImage"
            onChange={handleInputChange}
            value={formData.defineTheImage}
            placeholder="Give a short description of the image like its theme, specific elements, and objects that must be present (e.g., show a city of the future with tall buildings, flying cars, and high-tech stuff)"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="style">Style</label>
          <select
            className="form-control"
            name="style"
            onChange={handleInputChange}
            value={formData.style}
          >
            <option value="">Choose the visual style that best suits your topic and audience.</option>
            <option value="Illustrative">Illustrative</option>
            <option value="Photorealistic">Photorealistic</option>
            <option value="Abstract">Abstract</option>
            <option value="Cartoonish">Cartoonish</option>
            <option value="Minimalist">Minimalist</option>
            <option value="Surrealistic">Surrealistic</option>
          </select>
        </div>


        <Button title='Generate' type="submit" />

      </form>
    </div>
  )
};
export default CustomiseImages;