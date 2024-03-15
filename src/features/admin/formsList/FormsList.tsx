import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { fetchAllForms } from '../../../utils/firebaseUtils';
import { firestore } from '../../../utils/firebase';
import Button from '../../../components/buttons/Button';

import '../dashboard/Dashboard.css';

type UserDocumentData = {
    id: number,
    name: string;
    description: string;
    categoryName: string;
    followupPrompts: [];
    iconPath: string,
    redirect: string,
    isBookmarked: boolean,
    keyword?: string,
    usageCount?: number;
    usageCountBase?: number
    timeStamp? : string
};

const FormsList = () => {
    const [formData, setFormData] = useState<UserDocumentData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchData = async () => {
        try {
            const data = await fetchAllForms(firestore);
            setFormData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleExportClick = () => {
        try {
            // Flatten user data for better export
            const flattenedformData = formData.map(form => ({
                Id: form.id,
                Name: form.name,
                Description: form.description,
                'Category Name': form.categoryName,
                'Followup Prompts': Array.isArray(form.followupPrompts) ? form.followupPrompts.join(', ') : '',
                'Keyword': Array.isArray(form.keyword) ? form.keyword.join(', ') : '',
                'Usage Count': form.usageCount || 0, // Include Usage Count field
                'Usage Count Base': form.usageCountBase || 0, // Include Usage Count Base field
                Icon: form.iconPath,
                'Form Path': form.redirect,
                'Created At': form.timeStamp || '', // Include Created At field
                Bookmarked: form.isBookmarked ? 'Yes' : 'No',
            }));
            const ws = XLSX.utils.json_to_sheet(flattenedformData, { header: Object.keys(flattenedformData[0]) });
            // Auto-size columns
            const wscols = flattenedformData.map(form => Object.values(form).map(value => ({ width: value?.toString().length + 10 })));
            ws['!cols'] = wscols[0];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'FormsList');
            XLSX.writeFile(wb, 'FormsList.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };
    
    
    
    const handleSearchChange = (e:any) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='section'>
            <div className='sectionHeader'>
                <h1>All Forms ({formData?.length})</h1>

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
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category Name</th>
                            <th>Followup Prompts</th>
                            <th>Keyword</th>
                            <th>Usage Count</th>
                            <th>Usage Count Base</th>
                            <th>Icon</th>
                            <th>Form Path</th>
                            <th>Created At</th>
                            <th>Bookmarked</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData
                        .sort((a, b) => a.id - b.id)
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.id}</td>
                                    <td className='wrapWord'>{item?.name}</td>
                                    <td className='wrapWord'>{item?.description}</td>
                                    <td>{item?.categoryName}</td>
                                    <td>
                                        {item.followupPrompts && item.followupPrompts.length > 0 && item.followupPrompts.map((prompt, index) => (
                                            <span key={index}>
                                                {prompt}
                                                {index !== item.followupPrompts.length - 1 ? ', ' : ''}
                                                <br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        {item.keyword && item.keyword.length > 0 && item.keyword.map((prompt, index) => (
                                            <span key={index}>
                                                {prompt}
                                                {index !== item.keyword.length - 1 ? ', ' : ''}
                                                <br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>{item?.usageCount}</td>
                                    <td>{item?.usageCountBase}</td>
                                    <td>{item?.iconPath}</td>
                                    <td>{item?.redirect}</td>
                                    <td>{item?.timeStamp}</td>
                                    <td>{item?.isBookmarked ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default FormsList;
