// Import necessary libraries and components
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import emailjs from '@emailjs/browser';
import Button from '../../components/buttons/Button';
import Loader from '../../components/loader/Loader';
import Strings from '../../utils/en';
import LoginImages from '../../components/loginImages/loginImages';

import './AddUser.css';

const currentDateTime = new Date();
currentDateTime.setDate(currentDateTime.getDate() + 365);
const formattedDateTime = currentDateTime.toISOString().split('T')[0];
const registerDate = new Date().toISOString().split('T')[0];
const id = (Math.random() + 2).toString(36).substring(2);

const initialFormData = {
    id: id,
    name: '',
    email: '',
    phone: '',
    plan: 'Super',
    batch: '',
    password: '',
    total_credits: 0,
    remain_credits: 0,
    access_duration_days: 365,
    credits_limit_perday: 50,
    isActiveUser: true,
    isAdmin: false,
    expiry: formattedDateTime,
    register_timestamp: registerDate,
    isFreeUser: false,
    isPrePaidUser: false,
    campaignName: '',
    campaignSource: '',
    campaignMedium: ''
};

const AddSuperUser = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'phone' && isNaN(Number(value))) {
            // If it's not a valid number, don't update the state
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'phone' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const emailLowerCase = formData.email.toLowerCase();
            const docRef = doc(firestore, 'RegisteredUsers', emailLowerCase);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Document with this email exists
                const document = docSnap.data();

                await updateDoc(docRef, {
                    total_credits: document.total_credits + 1000,
                    remain_credits: document.remain_credits + 1000
                });

                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME_SUPER_EXISTING_USER,
                    {
                        registeredEmail: document.email,
                        registeredUsername: document.name,
                        registeredPlan: document.plan,
                        credits: 1000,
                        registeredDate: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
                        expiryDate: document.expiry.split('-').reverse().join('-'),
                        to_email: document.email,
                    },
                    import.meta.env.VITE_EMAILJS_API_KEY
                );
            } else {
                // No document with this email found, create new user
                const newUser = {
                    ...formData,
                    email: emailLowerCase,
                    total_credits: 1000,
                    remain_credits: 1000
                };

                await setDoc(docRef, newUser);

                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME_REGISTER,
                    {
                        registeredEmail: newUser.email,
                        registeredUsername: newUser.name,
                        registeredPlan: newUser.plan,
                        credits: 1000,
                        registeredDate: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
                        expiryDate: newUser.expiry.split('-').reverse().join('-'),
                        to_email: formData.email,
                    },
                    import.meta.env.VITE_EMAILJS_API_KEY
                );
            }
            setLoading(false);
            setFormData(initialFormData);
            alert('User Added Successfully')
        } catch (error) {
            setError('Error updating or adding user in Firestore: ' + error);
            alert('Error updating or adding user in Firestore: ' + error)
            setLoading(false);
        }
    };

    return (
        <div className='login-wrapper'>
            {loading && <Loader />}
            <LoginImages />
            {localStorage.getItem('username') === 'ankushb@upeducators.com' ? <div className='login-form'>
                <h1>{Strings.AddSuperUser.title}</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='name'>Name<span className='asterisk'>*</span></label>
                        <input type='name' required className='form-control' name='name' onChange={handleInputChange} value={formData.name} placeholder='Enter Name' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email<span className='asterisk'>*</span></label>
                        <input type='email' required className='form-control' name='email' onChange={handleInputChange} value={formData.email} placeholder='Enter Email' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='phone'>Phone<span className='asterisk'>*</span></label>
                        <input type='tel' required className='form-control' name='phone' onChange={handleInputChange} value={formData.phone} placeholder='Enter Phone' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='plan'>Plan<span className='asterisk'>*</span></label>
                        <input type='text' required className='form-control' name='plan' onChange={handleInputChange} value='Super' disabled />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='batch'>Batch <span className='asterisk'>*</span></label>
                        <input type='batch' required className='form-control' name='batch' onChange={handleInputChange} value={formData.batch} placeholder='Enter Batch' />
                    </div>
                    <Button title='Add User' type="submit" />
                </form>
            </div> : <div className="fallback-screen"> <h1>Admin secured page. </h1> </div>  }
            
        </div>
    );
};
export default AddSuperUser;
