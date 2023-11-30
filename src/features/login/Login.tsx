import { useNavigate } from "react-router-dom";
import Button from '../../components/buttons/Button';
import Strings from '../../localization/en';
import logo from '../../assets/Upeducator-logo.png';

import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/Categories");
    };

    return (
        <div className='login-wrapper'>
            <img src={logo} alt="Logo" className="login-logo" />
            <div className='login-visual'></div>
            <div className='login-form'>
                <h1>{Strings.login.title}</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='gradeLevel'>{Strings.login.email}</label>
                        <input type='email' className='form-control' required />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='gradeLevel'>{Strings.login.password}</label>
                        <input type='password' className='form-control' required />
                    </div>
                    <Button title={Strings.login.buttonLogin} type="submit" />
                </form>
            </div>
        </div>
    )
};

export default Login;