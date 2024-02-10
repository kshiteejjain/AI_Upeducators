import React, { useState, ReactElement } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import CSVReader from 'react-csv-reader';
import Header from '../../components/header/Header';
import Button from '../../components/buttons/Button';
import './UploadUsers.css';
type UploadUsersCSVProps = {};
const UploadUsersCSV: React.FC<UploadUsersCSVProps> = (): ReactElement => {
    const [csvData, setCsvData] = useState<string[][] | undefined>();
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/Categories');
    };
    const handleCSVRead = (data: string[][]) => {
        // Process the CSV data as needed
        setCsvData(data);
    };
    const uploadDataToFirestore = async () => {
        if (!csvData) {
            alert('No CSV data available.');
            return;
        }
        const headers = csvData[0];
        // Assuming each subsequent row contains data
        const dataRows = csvData?.slice(1);
        const formattedData = dataRows?.map((row) => {
            const document: Record<string, string | number> = {};
            row.forEach((value, index) => {
                // Use headers to map the values to field names
                if (headers[index] === 'isActiveUser' || headers[index] === 'isAdmin' || headers[index] === 'isBookmarked') {
                    // Convert 'true' or 'false' string to boolean
                    document[headers[index]] = value.toLowerCase() === 'true';
                } else {
                    // For other fields, convert to number if applicable
                    document[headers[index]] = isNaN(Number(value)) ? value : Number(value);
                }
            });
            return document;
        });
        
        try {
            const collectionRef = collection(firestore, 'ExistingUsersBulkUploaded');
            const existingUsers = await getDocs(collectionRef);
            // Check if any uploaded email matches an existing user's email
            const duplicateEmails = formattedData
                .map((item) => item['email'])
                .filter((email) => existingUsers.docs.some((doc) => doc.data().email === email));
            if (duplicateEmails.length > 0) {
                alert(`Duplicate users found with emails: ${duplicateEmails.join(', ')}`);
                return;
            }
            // Add data to Firestore
            await Promise.all(
                formattedData?.map(async (item) => {
                    await addDoc(collectionRef, item);
                })
            );
            alert('Data uploaded to Firestore successfully!');
        } catch (error) {
            alert('Error uploading data to Firestore:', error);
        }
    };
    return (
        <>
            <Header />
            <div className="uploadForm">
                <h2>Upload Existing Users to Firebase</h2>
                <p>
                    Prior to uploading users' data in CSV format, kindly ensure that the existing data is cleared to prevent duplication.
                </p>
                <div className="form-group">
                    <CSVReader onFileLoaded={handleCSVRead} />
                </div>
                <Button title="Upload Data" type="button" onClick={uploadDataToFirestore} />
                <Button isSecondary title="Go to Categories" type="button" onClick={goHome} />
            </div>
        </>
    );
};
export default UploadUsersCSV;
