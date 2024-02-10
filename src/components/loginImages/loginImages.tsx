import { useEffect, useState } from "react";
import logo from '../../assets/Upeducator-logo.png';
import './loginImages.css';
const LoginImages = () => {
    const [image, setImage] = useState('');
    useEffect(() => {
        // Fetch images or use any logic to get a list of image URLs
        const imageList = [
            'assets/login-bg.jpg',
            'assets/login-bg2.jpg',
            'assets/login-bg3.jpg',
            'assets/login-bg4.jpg',
        ];
        const randomIndex = Math.floor(Math.random() * imageList.length);
        setImage(imageList[randomIndex]);
    }, []);
    return (
        <>
            <img src={logo} alt="Logo" className="login-logo" />
            <div className='login-visual' style={{ backgroundImage: `url(${image})` }}>
            </div>
        </>
    )
};
export default LoginImages;