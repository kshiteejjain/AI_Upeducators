import React, { useState, ReactElement } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import CSVReader from 'react-csv-reader';
import Button from '../../components/buttons/Button';

import './BulkUpload.css';

type BulkUsersUploadProps = {};
const currentDateTime = new Date();
currentDateTime.setDate(currentDateTime.getDate() + 365)
const formattedDateTime = currentDateTime.toISOString().split('T')[0];
const registerDate = new Date().toISOString().split('T')[0];
const initialFormData = {
    name: '',
    email: '',
    phone: '',
    plan: '',
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

const BulkUsersUpload: React.FC<BulkUsersUploadProps> = (): ReactElement => {
    const [csvData, setCsvData] = useState<string[][] | undefined>(initialFormData);
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/Categories');
    };
    const handleCSVRead = (data: string[][]) => {
        // Process the CSV data as needed
        setCsvData(data);
    };



    // Function to generate a random alphanumeric password
    const generateRandomPassword = () => {
        const length = 8;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };



    const uploadUsersToFirestore = async () => {
        if (!csvData) return alert('No CSV data available.');
        const collectionRef = collection(firestore, 'RegisteredUsers');
        const dataRows = csvData.slice(1);
        const headers = csvData[0]; // Extracting headers from CSV data
        try {
            await Promise.all(
                dataRows.map(async (row) => {
                    const document = { ...initialFormData }; // Merge with initialFormData
                    let creditsToAdd = 0;

                    row.forEach((value, index) => {
                        const headerLowercase = headers[index].toLowerCase();
                        if (headerLowercase === 'plan') {
                            document[headerLowercase] = value;
                            creditsToAdd = value.toLowerCase() === 'super' ? 1000 : 0;
                        } else if (['name', 'email', 'plan', 'batch', 'phone'].includes(headerLowercase)) {
                            document[headerLowercase] = value;
                        } else if (!Object.keys(document).includes(headerLowercase)) {
                            if (['isactiveuser', 'isadmin', 'isbookmarked'].includes(headerLowercase))
                                document[headerLowercase] = value.toLowerCase() === 'true';
                            else
                                document[headerLowercase] = isNaN(Number(value)) ? value : Number(value);
                        }
                    });

                    const email = document['email'];
                    if (!email) throw new Error('Email is required.');

                    // Check if email already exists in RegisteredUsers
                    const docRef = doc(collectionRef, email);
                    //const docSnapshot = await getDoc(docRef);
                    // if (docSnapshot.exists()) {
                    //     // Email already exists, log a message and skip processing this row
                    //     alert(`Email ${email} already exists in RegisteredUsers. Skipping...`);
                    //     return;
                    // }

                    // Generate random password
                    const password = generateRandomPassword();

                    // If the document doesn't exist, create a new one
                    document['total_credits'] = creditsToAdd;
                    document['remain_credits'] = creditsToAdd;

                    // Set the password
                    document['password'] = password;


                    // Add the document to Firestore
                    await setDoc(docRef, document);
                })
            );
            alert('Data uploaded to Firestore successfully!');
        } catch (error) {
            alert(`Error uploading data to Firestore: ${error}`);
        }
    };



    return (
        <div className="uploadForm">
            <h2>Upload Bulk Users CSV</h2>
            <div className="form-group">
                <CSVReader onFileLoaded={handleCSVRead} />
            </div>
            <Button title="Upload Data" type="button" onClick={uploadUsersToFirestore} />
            <Button isSecondary title="Go to Categories" type="button" onClick={goHome} />
        </div>

    );
};
export default BulkUsersUpload;
