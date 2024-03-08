import { useEffect } from 'react';
import carousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import GoogleCertifiedEducator from '../../assets/google-certified-educator.svg'
import DigitalMarketingCourseForEducators from '../../assets/Digital-Marketing-Course-for-Educators.svg'
import MicrosoftCertifiedEducators from '../../assets/Microsoft-Certified-Educators.svg'

import './bannerCarousel.css';

const BannerCarousel = () => {
    const [emblaRef, emblaApi] = carousel({ loop: true }, [Autoplay()]);

    useEffect(() => {
        
      }, [emblaApi])

    return (
        <div className="carousel" ref={emblaRef}>
            <div className="carousel__container">
                <div className="carousel__slide"> <a href="https://www.upeducators.com/google-certified-educator/" target='blank'> <img src={GoogleCertifiedEducator} /></a></div>
                <div className="carousel__slide"><a href="https://www.upeducators.com/digital-marketing-for-educators/" target='blank'> <img src={DigitalMarketingCourseForEducators} /> </a> </div>
                <div className="carousel__slide"> <a href="https://www.upeducators.com/microsoft-certified-educators/" target='blank'> <img src={MicrosoftCertifiedEducators} /></a> </div>
            </div>
        </div>
    );
};

export default BannerCarousel;