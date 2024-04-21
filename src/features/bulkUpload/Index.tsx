import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { fetchAllUserData } from '../../utils/firebaseUtils';
import Header from '../../components/header/Header';
import BulkFormsUpload from './BulkFormsUpload';
import BulkUsersUpload from './BulkUsersUpload';
import errorImg from '../../assets/error-img.svg';
import Button from '../../components/buttons/Button';



const Index = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersData = await fetchAllUserData(firestore);
                const adminExists = usersData.some((user: any) => user.email === localStorage.getItem('username') && user.isAdmin);
                setIsAdmin(adminExists);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);
    return (
        <>
            <Header />
            <div className='uploadFormWrapper'>
                {isAdmin ? <>
                    <BulkUsersUpload />
                <BulkFormsUpload />
                </> : <div className='no-access'> <img src={errorImg} /> <h2>You don't have access</h2> <Button isSecondary title="Go to Categories" type="button" onClick={()=> navigate('/Categories')} /> </div>}
               
            </div>
        </>
    )
};
export default Index;