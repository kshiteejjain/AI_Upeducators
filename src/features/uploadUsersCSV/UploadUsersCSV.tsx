import React, { useState, ReactElement } from 'react';
import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
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
    const uploadUsersToFirestore = async () => {
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




    const uploadFormsToFirestore = async () => {
        if (!csvData) {
            alert('No CSV data available.');
            return;
        }
        const headers = csvData[0];
        // Assuming each subsequent row contains data
        const dataRows = csvData?.slice(1);
        const formattedData = dataRows?.map((row) => {
            const document: Record<string, string | number | boolean | any[]> = {};
            let documentId: string | null = null; // Initialize documentId variable

            row.forEach((value, index) => {
                switch (headers[index]) {
                    case 'Bookmarked':
                        document['isBookmarked'] = value.toLowerCase() === 'yes';
                        break;
                    case 'Category Name':
                        document['categoryName'] = value;
                        break;
                    case 'Created At':
                        document['timeStamp'] = value;
                        break;
                    case 'Form Path':
                        document['redirect'] = value;
                        break;
                    case 'Icon':
                        document['iconPath'] = value;
                        break;
                    case 'Usage Count':
                        document['usageCount'] = isNaN(Number(value)) ? null : Number(value);
                        break;
                    case 'Usage Count Base':
                        document['usageCountBase'] = isNaN(Number(value)) ? null : Number(value);
                        break;
                    case 'Description':
                        document['description'] = value;
                        break;
                    case 'Id':
                        document['id'] = isNaN(Number(value)) ? null : Number(value);
                        break;
                    case 'Name':
                        document['name'] = value;
                        documentId = value; // Assign value to documentId
                        break;
                    case 'Followup Prompts':
                        document['followupPrompts'] = value.split(',').map(item => item.trim());
                        break;
                    case 'Keyword':
                        document['keyword'] = value.split(/[?,]/).map(item => item.trim());
                        break;
                    default:
                        document[headers[index]] = value;
                        break;
                }
            });

            return document;
        });


        try {
            const collectionRef = collection(firestore, 'FormsList');
            const existingUsers = await getDocs(collectionRef);
            const duplicateNames = formattedData
                .map((item) => item['name'])
                .filter((name) => existingUsers.docs.some((doc) => doc.id === name));
            if (duplicateNames.length > 0) {
                alert(`Duplicate names found: ${duplicateNames.join(', ')}`);
                return;
            }
        
            // Add data to Firestore
            await Promise.all(
                formattedData.map(async (item) => {
                    const docRef = doc(collectionRef, item['name']); // Using document['name'] as document id
                    await setDoc(docRef, item);
                })
            );
            alert('Data uploaded to Firestore successfully!');
        } catch (error) {
            console.error('Error uploading data:', error);
            // Handle error
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
                <Button title="Upload Data" type="button" onClick={uploadUsersToFirestore} />
                <Button isSecondary title="Go to Categories" type="button" onClick={goHome} />
            </div>
            <div className="uploadForm">
                <h2>Upload Forms to Firebase</h2>
                <div className="form-group">
                    <CSVReader onFileLoaded={handleCSVRead} />
                </div>
                <Button title="Upload Data" type="button" onClick={uploadFormsToFirestore} />
                <Button isSecondary title="Go to Categories" type="button" onClick={goHome} />
            </div>
        </>
    );
};
export default UploadUsersCSV;
