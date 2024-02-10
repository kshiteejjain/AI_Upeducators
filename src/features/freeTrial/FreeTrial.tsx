import { useState, ChangeEvent, FormEvent } from 'react';
import { firestore } from '../../utils/firebase';
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/buttons/Button';
import LoginImages from '../../components/loginImages/loginImages';
import Strings from '../../utils/en';
import './FreeTrial.css';
const FreeTrial = () => {
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Teacher',
        credit: 10,
        remain_credits: 10,
        freeTrial: true,
        register_timestamp: formattedDateTime
    })
    // const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const navigate = useNavigate();
    // useEffect(() => {
    //     const checkPassword = async () => {
    //         const enteredPassword = window.prompt('Enter Code:');
    //         if (enteredPassword === 'aiweb*@$%growth') {
    //             setIsPasswordCorrect(true);
    //         } else {
    //             alert('Incorrect Code. Access denied.');
    //             // Redirect or handle unauthorized access
    //         }
    //     };
    //     checkPassword();
    // }, []);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            [name]: name === 'phone' ? Number(value) : value,
        }));
    };
    const handleForgotPassword = () => {
        navigate('/ForgotPassword')
    }
    const formSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const querySnapshot = await getDocs(
                query(collection(firestore, 'FreeTrialUsers'), where('email', '==', formData.email))
            );
            if (!querySnapshot.empty) {
                // Email already exists, show alert or handle accordingly
                alert('Email is already registered!');
                return;
            }
            const FreeTrialedUsersCollection = collection(firestore, 'FreeTrialUsers');
            // Adding the form data to the Firestore collection
            await addDoc(FreeTrialedUsersCollection, formData);
            // Optional: Clear the form after submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: 'Teacher',
                credit: 10,
                remain_credits: 10,
                FreeTrialed: true,
                register_timestamp: formattedDateTime
            });
            alert('Registration Successful, Redirecting to login.');
            navigate('/')
        } catch (error) {
            alert('An error occurred:', error);
        }
    };
    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-form'>
                <h1>{Strings.FreeTrial.title}</h1>
                <form onSubmit={formSubmit}>
                    <div className='form-group'>
                        <label htmlFor='name'>Name <span className='asterisk'>*</span></label>
                        <input type='text' required className='form-control' name='name' onChange={handleInputChange} value={formData.name} placeholder='Enter Name' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email <span className='asterisk'>*</span></label>
                        <input type='email' required className='form-control' name='email' onChange={handleInputChange} value={formData.email} placeholder=' Enter Email' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='phone'>Phone <span className='asterisk'>*</span></label>
                        <input type='tel' required className='form-control' name='phone' onChange={handleInputChange} value={formData.phone} placeholder='Enter Phone' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password <span className='asterisk'>*</span></label>
                        <input type='text' required className='form-control' name='password' onChange={handleInputChange} value={formData.password} placeholder='Enter Password' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='role'>Your Role <span className='asterisk'>*</span> </label>
                        <select required className='form-control' name="role" onChange={handleInputChange} value={formData.role}>
                            <option value="Teacher">Teacher</option>
                            <option value="Trainer">Trainer</option>
                            <option value="Owner">Owner</option>
                        </select>
                    </div>
                    <Button title='Register' type="submit" />
                </form>
                <div className='text-center'>
                    <Button title='Forgot Password?' isSecondary type="button" onClick={() => handleForgotPassword()} />
                </div>
            </div>
        </div>
    )
};
export default FreeTrial;