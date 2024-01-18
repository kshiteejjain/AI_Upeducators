import { useEffect, useState } from 'react';
import { firestore } from '../../../utils/firebase';
import { fetchAllCategories, fetchAllForms, categoryStats } from '../../../utils/firebaseUtils';
import Header from '../../../components/header/Header';
import RegisteredUsers from '../manageUsers/RegisteredUsers';
import FreeTrialUsers from '../manageUsers/FreeTrialUsers';
import AdminCards from '../../../components/adminCards/AdminCards';
import CustomLineChart from '../../../components/CustomCharts/CustomCharts';




const Dashboard = () => {
    const [categoryLength, setCategoryLength] = useState<number | null>(null);
    const [formsLength, setFormsLength] = useState<number | null>(null);
    const [categoryStatsData, setCategoryStatsData] = useState<number | null>(null);

    const chartData = categoryStatsData?.map(({ categoryName, count }) => ({
        name: categoryName,
        Count: count,
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await fetchAllCategories();
                setCategoryLength(categories.length);

                const forms = await fetchAllForms();
                setFormsLength(forms.length);

                const usedCategoryStats = await categoryStats(firestore);
                setCategoryStatsData(usedCategoryStats);

                // Move the console.log here
                console.log('categoryStats', usedCategoryStats);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (categoryLength === null || formsLength === null) {
        // Loading state or handle appropriately
        return null;
    }

    return (
        <div>
            <Header />
            <div className='cardsFlex'>
                <AdminCards
                    title="Total Categories"
                    value={categoryLength.toString()}
                    bgColor="one"
                />
                <AdminCards
                    title="Total Forms"
                    value={formsLength.toString()}
                    bgColor="two"
                />
                <AdminCards
                    title="Weekly Sales"
                    value="150000"
                    bgColor="three"
                />
            </div>
            <div className='wrapper'>
            <CustomLineChart
                data={chartData}
                legendKey="name"
                xKey="name"
                yKey="Count"
            />
            <RegisteredUsers />
            <FreeTrialUsers />
        </div>
        </div>
    );
};

export default Dashboard;
