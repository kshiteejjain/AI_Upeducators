import { SetStateAction, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { fetchAllUserData } from '../../../utils/firebaseUtils';
import { firestore } from '../../../utils/firebase';
import Button from '../../../components/buttons/Button';
import { collection, deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Loader from '../../../components/loader/Loader';
import '../dashboard/Dashboard.css';

type UserDocumentData = {
    name: string;
    email: string;
    password: string;
    phone: number;
    total_credits: number;
    remain_credits: number;
    access_duration_days: number;
    credits_limit_perday: number;
    isActiveUser: boolean;
    isAdmin: boolean;
    register_timestamp: string;
};

const RegisteredUsers = () => {
    const [userData, setUserData] = useState<UserDocumentData[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loader, setLoader] = useState(true);
    const [editingUser, setEditingUser] = useState<UserDocumentData | null>(null);
    const [editedData, setEditedData] = useState<UserDocumentData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersData = await fetchAllUserData(firestore);
                setUserData(usersData);
                const adminExists = usersData.some(user => user.email === localStorage.getItem('username') && user.isAdmin);
                setIsAdmin(adminExists);
                setLoader(false)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);
    const handleEditClick = (user: UserDocumentData) => {
        setEditingUser(user);
        setEditedData({ ...user });
    };
    const handleSaveClick = async () => {
        if (editingUser && editedData) {
            try {
                const collectionRef = collection(firestore, 'RegisteredUsers');
                // Use a query to find the document based on email
                const q = query(collectionRef, where('email', '==', editingUser.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Document found, proceed with the update
                    const userDocRef = querySnapshot.docs[0].ref;
                    await updateDoc(userDocRef, editedData);
                    // Fetch updated user data
                    const updatedUserData = await fetchAllUserData(firestore);
                    setUserData(updatedUserData);
                    setEditingUser(null);
                    setEditedData(null);
                } else {
                    // Document not found, handle this case
                    console.error('Error updating user data: Document not found');
                }
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }
    };
    const handleDeleteClick = async (user: UserDocumentData) => {
        if (window.confirm(`Are you sure you want to delete the user ${user.name}?`)) {
            try {
                const collectionRef = collection(firestore, 'RegisteredUsers');
                // Use a query to find the document based on email
                const q = query(collectionRef, where('email', '==', user.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Document found, proceed with the delete
                    const userDocRef = querySnapshot.docs[0].ref;
                    await deleteDoc(userDocRef);
                    // Fetch updated user data
                    const updatedUserData = await fetchAllUserData(firestore);
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
                'Total Credits': user.total_credits,
                'Remaining Credits': user.remain_credits,
                'Access Duration': user.access_duration_days,
                'Credits Limit Perday': user.credits_limit_perday,
                'Is Active User': user.isActiveUser ? 'Yes' : 'No',
                'Is Admin': user.isAdmin ? 'Yes' : 'No',
                'Date of Registration': user.register_timestamp,
            }));
            const ws = XLSX.utils.json_to_sheet(flattenedUserData, { header: Object.keys(flattenedUserData[0]) });
            // Auto-size columns
            const wscols = flattenedUserData.map(user => Object.values(user).map(value => ({ width: value?.toString().length + 15 })));
            ws['!cols'] = wscols[0];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'All_Registered_Users');
            XLSX.writeFile(wb, 'All_Registered_Users.xlsx');
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
                        <h1>All Registered Users ({userData?.length})</h1>
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
                                    <th>Total Credits</th>
                                    <th>Remaining Credits</th>
                                    <th>Access Duration</th>
                                    <th>Expiry Date</th>
                                    <th>Credits Limit Perday</th>
                                    <th>Is Active User</th>
                                    <th>Is Admin</th>
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
                                            <td>
                                                {editingUser && editingUser.email === user.email ? (
                                                    <input
                                                        type="text"
                                                        value={editedData?.email || ''}
                                                        onChange={(e) =>
                                                            setEditedData({
                                                                ...editedData,
                                                                email: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    user.email
                                                )}
                                            </td>
                                            <td>
                                                {editingUser && editingUser.email === user.email ? (
                                                    <input
                                                        type="text"
                                                        value={editedData?.password || ''}
                                                        onChange={(e) =>
                                                            setEditedData({
                                                                ...editedData,
                                                                password: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    user.password
                                                )}
                                            </td>
                                            <td>
                                                {editingUser && editingUser.email === user.email ? (
                                                    <input
                                                        type="text"
                                                        value={editedData?.phone || ''}
                                                        onChange={(e) =>
                                                            setEditedData({
                                                                ...editedData,
                                                                phone: Number(e.target.value,)
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    user.phone
                                                )}
                                            </td>
                                            <td>{editingUser && editingUser.email === user.email ? (
                                                <input
                                                    type="number"
                                                    value={editedData?.total_credits || ''}
                                                    onChange={(e) =>
                                                        setEditedData({
                                                            ...editedData,
                                                            total_credits: Number(e.target.value,)
                                                        })
                                                    }
                                                />
                                            ) : (
                                                user.total_credits
                                            )}</td>
                                            <td>{editingUser && editingUser.email === user.email ? (
                                                <input
                                                    type="number"
                                                    value={editedData?.remain_credits || ''}
                                                    onChange={(e) =>
                                                        setEditedData({
                                                            ...editedData,
                                                            remain_credits: Number(e.target.value,)
                                                        })
                                                    }
                                                />
                                            ) : (
                                                user.remain_credits
                                            )}</td>
                                            <td>{editingUser && editingUser.email === user.email ? (
                                                <input
                                                    type="number"
                                                    value={editedData?.access_duration_days || ''}
                                                    onChange={(e) =>
                                                        setEditedData({
                                                            ...editedData,
                                                            access_duration_days: Number(e.target.value,)
                                                        })
                                                    }
                                                />
                                            ) : (
                                                user.access_duration_days
                                            )}</td>
                                            <td>{editingUser && editingUser.email === user.email ? (
                                                <input
                                                    type="text"
                                                    value={editedData?.credits_limit_perday || ''}
                                                    onChange={(e) =>
                                                        setEditedData({
                                                            ...editedData,
                                                            credits_limit_perday: Number(e.target.value,)
                                                        })
                                                    }
                                                />
                                            ) : (
                                                user.credits_limit_perday
                                            )}</td>
                                            <td>
                                                {editingUser && editingUser.email === user.email ? (
                                                    <select
                                                        value={editedData?.isActiveUser || false}
                                                        onChange={(e) =>
                                                            setEditedData({
                                                                ...editedData,
                                                                isActiveUser: e.target.value === 'true'
                                                            })
                                                        }
                                                    >
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                                ) : (
                                                    user.isActiveUser ? 'Yes' : <strong className='cellHighlight red'>No</strong>
                                                )}
                                            </td>
                                            <td>
                                                {editingUser && editingUser.email === user.email ? (
                                                    <select
                                                        value={editedData?.isAdmin || false}
                                                        onChange={(e) =>
                                                            setEditedData({
                                                                ...editedData,
                                                                isAdmin: e.target.value === 'true'
                                                            })
                                                        }
                                                    >
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                                ) : (
                                                    user.isAdmin ? <strong className='cellHighlight blue'>Yes</strong> : 'No'
                                                )}
                                            </td>
                                            <td>{user.register_timestamp}</td>
                                            <td>
                                                {editingUser && editingUser.email === user.email ? (
                                                    <Button title='Save' isSecondary onClick={() => handleSaveClick()} />
                                                ) : (
                                                    <Button title='Edit User' isSecondary onClick={() => handleEditClick(user)} />
                                                )}
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
export default RegisteredUsers;
