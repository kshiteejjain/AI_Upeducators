import React, { useState, ReactElement } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import CSVReader from 'react-csv-reader';
import Button from '../../components/buttons/Button';


import './BulkUpload.css';

type BulkFormsUploadProps = {};

const BulkFormsUpload: React.FC<BulkFormsUploadProps> = (): ReactElement => {
    const [csvData, setCsvData] = useState<string[][] | undefined>();
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/Categories');
    };
    const handleCSVRead = (data: string[][]) => {
        // Process the CSV data as needed
        setCsvData(data);
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
                        break;
                    case 'Followup Prompts':
                        document['followupPrompts'] = value.split(',').map(item => item.trim());
                        break;
                    case 'Keyword':
                        document['keyword'] = value.split(/[?,]/).map(item => item.trim());
                        break;
                    case 'Likes':
                        document['likes'] = isNaN(Number(value)) ? null : Number(value);
                        break;
                    case 'Dislikes':
                        document['dislikes'] = isNaN(Number(value)) ? null : Number(value);
                        break;
                    case 'isActive':
                        document['isActive'] = value.trim().toLowerCase() === 'yes';
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

            // Prepare data to be uploaded
            await Promise.all(
                formattedData.map(async (item) => {
                    const docRef = doc(collectionRef, item['name']); // Using document['name'] as document id
                    // Check if the document already exists
                    if (existingUsers.docs.some((doc) => doc.id === item['name'])) {
                        // Document exists, update it
                        await setDoc(docRef, item, { merge: true });
                    } else {
                        // Document does not exist, create new
                        await setDoc(docRef, item);
                    }
                })
            );
            alert('Data uploaded to Firestore successfully! Existing entries were updated.');
        } catch (error) {
            console.error('Error uploading data:', error);
            alert(error);
            // Handle error
        }

    };


    return (
        <div className="uploadForm">
            <h2>Upload Forms CSV</h2>
            <div className="form-group">
                <CSVReader onFileLoaded={handleCSVRead} />
            </div>
            <Button title="Upload Data" type="button" onClick={uploadFormsToFirestore} />
            <Button isSecondary title="Go to Categories" type="button" onClick={goHome} />
        </div>
    );
};
export default BulkFormsUpload;
