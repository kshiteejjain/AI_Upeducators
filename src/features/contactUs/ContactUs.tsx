import Header from "../../components/header/Header";
import ContactImage from "../../assets/contactUs.jpg";
import './ContactUs.css';

const ContactUs = () => {
 
    return (
        <>
            <Header />
            <div className="contactWrapper">
                <div className="contactImage"> <img src={ContactImage} alt="Contact Us" title="Contact Us" /> </div>
                <div className="contactDetails">
                    <h1>Contact Us</h1>
                    <h2>Account Expired</h2>
                    <p>Should you require <strong>additional credits</strong>, please do not hesitate to contact our support team through the provided channels. 
                    <br />We are here to assist you and discuss any options available to meet your credit needs. 
                    </p>
                    <p>Our Plans: <a href="https://upeducators.ai/pricing/"> Click Here to Upgrade</a></p>
                    <p>Email: <a href="mailto:9923460060">info@upeducators.com</a></p>
                    <p>Call: <a href="tel:9923460060">981-986-0060</a></p>
                </div>
            </div>
        </>
    )
};
export default ContactUs;