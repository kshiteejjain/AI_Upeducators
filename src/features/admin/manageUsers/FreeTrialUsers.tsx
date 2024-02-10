import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { freeTrialUsers } from '../../../utils/firebaseUtils';
import { firestore } from '../../../utils/firebase';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import Loader from '../../../components/loader/Loader';
import Button from '../../../components/buttons/Button';
import '../dashboard/Dashboard.css';

type UserDocumentData = {
    name: string;
    email: string;
    password: string;
    phone: number;
    credit: number;
    remain_credits: number;
    freeTrial: number;
    expire_date: string;
    credits_limit_perday: number;
    register_timestamp: string;
    role: string;
};

const FreeTrialUsers = () => {
    const [userData, setUserData] = useState<UserDocumentData[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loader, setLoader] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const usersData = await freeTrialUsers(firestore);
                setUserData(usersData);
                const adminExists = usersData.some(user => user.email === sessionStorage.getItem('username') && user.isAdmin);
                setIsAdmin(adminExists);
                setLoader(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        checkAdminStatus();
    }, []);
    const handleDeleteClick = async (user: UserDocumentData) => {
        if (window.confirm(`Are you sure you want to delete the user ${user.name}?`)) {
            try {
                const collectionRef = collection(firestore, 'FreeTrialUsers');
                // Use a query to find the document based on email
                const q = query(collectionRef, where('email', '==', user.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Document found, proceed with the delete
                    const userDocRef = querySnapshot.docs[0].ref;
                    await deleteDoc(userDocRef);
                    // Fetch updated user data
                    const updatedUserData = await freeTrialUsers(firestore);
                    setUserData(updatedUserData);
                } else {
                    // Document not found, handle this case
                    console.error('Error deleting user: Document not found');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };
    const handleExportClick = () => {
        try {
            // Flatten user data for better export
            const flattenedUserData = userData.map(user => ({
                Name: user.name,
                Email: user.email,
                Password: user.password,
                Phone: user.phone,
                Role: user.role,
                Credit: user.credit,
                Remain_credits: user.remain_credits,
                FreeTrial: user.freeTrial,
                Register_timestamp: user.register_timestamp,
            }));
            const ws = XLSX.utils.json_to_sheet(flattenedUserData, { header: Object.keys(flattenedUserData[0]) });
            // Auto-size columns
            const wscols = flattenedUserData.map(user => Object.values(user).map(value => ({ width: value.toString().length + 10 })));
            ws['!cols'] = wscols[0];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Free_Trial_Users');
            XLSX.writeFile(wb, 'Free_Trial_Users.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            {loader ? <Loader /> : <>
                <div className='section'>
                    <div className='sectionHeader'>
                        <h1>Free Trial Users ({userData?.length})</h1>
                        
                        <div className='sectionHeaderWithSearch'>
                            <input
                                type="text"
                                placeholder="Search by keyword"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className='form-control'
                            />
                            <Button title='Export to Excel' isSecondary onClick={handleExportClick} />
                        </div>
                    </div>
                    <div className='tableWrapper'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Credit</th>
                                    <th>Remain Credit</th>
                                    <th>Free Trial</th>
                                    <th>Date of Registration</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData
                                    .filter((user) =>
                                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        user.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((user) => (
                                        <tr key={user.email}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.password}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.role}</td>
                                            <td>{user.credit}</td>
                                            <td>{user.remain_credits}</td>
                                            <td>{user.freeTrial ? 'Yes' : <strong className='cellHighlight red'>No</strong>}</td>
                                            <td>{user.register_timestamp}</td>
                                            <td>
                                                <Button title='Delete User' isSecondary isDangerous onClick={() => handleDeleteClick(user)} />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>}
        </>
    );
};
export default FreeTrialUsers;
