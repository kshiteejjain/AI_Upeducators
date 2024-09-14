import { useNavigate } from 'react-router-dom';

import  './Footer.css';

const Footer = () => {
    const navigate = useNavigate();
    return(
        <div className="footer">
            <button onClick={()=> navigate('/TermsConditions')}>Terms and Conditions</button>
            <button onClick={()=> navigate('/PrivacyPolicy')}>Privacy Policy</button>
    </div>
    )
};
export default Footer;