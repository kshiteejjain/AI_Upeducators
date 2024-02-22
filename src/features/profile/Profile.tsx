import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firebase';
import { categoryStats, fetchTotalCredits } from '../../utils/firebaseUtils';
import { setCategory } from '../categories/CategoriesSlice';
import Header from '../../components/header/Header';
import Strings from '../../utils/en';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './Profile.css';



const Profile = () => {
    const [username, setUsername] = useState('');
    const [statsData, setStatsData] = useState([]);
    const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);
    const [isAdmin, setIsAdmin] = useState(false);
    const showUsername = (name: string) => {
        const email = name.split('@');
        return email[0];
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await categoryStats(firestore); // Fetch data from categoryStats function
                setStatsData(data);
            } catch (error) {
                console.error('Error fetching category stats:', error);
            }
        };

        fetchData(); // Call fetchData function on component mount
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUsername = localStorage.getItem('username') ?? 'User';
                setUsername(showUsername(storedUsername));
                // Fetch only setRemainingCredits
                await fetchTotalCredits(storedUsername, undefined, setRemainingCredits, setIsAdmin);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle errors as needed
            }
        };
        fetchData();
        if (remainingCredits !== undefined && remainingCredits <= 0) {
        }
    }, [remainingCredits]);

    const handleTile = (categoryName: string) => {
        dispatch(setCategory(categoryName));
        navigate('/GeneratorAndResult');
    };

    return (
        <>
            <Header />
            <div className='wrapper'>
                <div className='profile-flex'>
                    <div className='profile-cards'>
                        <h2> Profile </h2>
                        <p>{Strings.header.email}: {localStorage.getItem('username')}</p>
                        <p>{Strings.header.remainingCredits} {remainingCredits}</p>
                    </div>
                    <div className='profile-cards'>
                        <h2> Search History </h2>
                        <div className='tableWrapper'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Form Name</th>
                                        <th>Usage</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statsData
                                        .filter((item) =>
                                            item.user === localStorage.getItem('username') ?? 'User')
                                        .map((item, index) => {
                                            // Split the category name by uppercase letters and join with spaces
                                            const formattedCategoryName = item.categoryName
                                                .split(/(?=[A-Z])/)
                                                .join(' ');
                                            return (
                                                <tr key={index}>
                                                    <td onClick={() => handleTile(item.categoryName)}><span className='link'>{formattedCategoryName}</span></td>
                                                    <td>{item.count}</td>
                                                    <td>{item.timeStamp}</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default Profile;