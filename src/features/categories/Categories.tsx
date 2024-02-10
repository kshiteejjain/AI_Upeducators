import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCategory } from './CategoriesSlice';
import { resetGeneratedData } from '../../features/promptListGeneratorSlice/QuestionGeneratorSlice';
import CategoryTiles from '../../components/categoryTiles/CategoryTiles';
import Header from '../../components/header/Header';
import { fetchAllForms } from '../../utils/firebaseUtils';
import CategoriesFilter from '../categoriesFilter/CategoriesFilter';
import Strings from '../../utils/en';
import './Categories.css';

type Props = {
    name: string;
    description: string;
    iconPath: string;
    IconComponent: string;
    redirect?: string;
    onClick?: () => void;
};
const Categories = () => {
    const [categories, setCategories] = useState<Props[]>([]);
    const [filterCategory, setFilterCategory] = useState(() => {
        return localStorage.getItem('filterCategory') || 'All';
    });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getIconPath = async (iconPath: string) => {
        try {
            const iconModule = await import(`../../assets/${iconPath}.svg`);
            return iconModule.default;
        } catch (error) {
            alert(`Error loading icon ${iconPath}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await fetchAllForms();
                const iconPathsData = await Promise.all(categoryData.map(async (category: Prop) => {
                    const path = category.iconPath ? await getIconPath(category.iconPath) : null;
                    return { [category.name]: path };
                }));
                const iconPathsObject = Object.assign({}, ...iconPathsData);
                const formattedCategories = categoryData.map((category) => ({
                    name: category?.name,
                    IconComponent: iconPathsObject[category?.name],
                    categoryName: category?.categoryName,
                    description: category?.description,
                    id: category?.id,
                    redirect: category?.redirect,
                    isBookmarked: category?.isBookmarked,
                }));
                setCategories(formattedCategories);
            } catch (error) {
                alert('Error fetching categories:', error);
            }
        };
        fetchData();
        localStorage.setItem('filterCategory', filterCategory);
        setFilterCategory(localStorage.getItem('filterCategory') || 'All');
    }, [filterCategory]);

    const handleTile = (redirect?: string) => {
        if (redirect) {
            dispatch(setCategory(redirect));
            navigate('/GeneratorAndResult')
        }
    };
    const handleCategorySelect = (selectedCategory: string) => {
        setFilterCategory(selectedCategory)
    };
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    return (
        <>
            <Header />
            <div className='page-wrapper'>
                <div className='container'>
                    <CategoriesFilter onSelect={handleCategorySelect} />
                    <div className='category-listing-wrapper'>
                        <div className='search-wrapper'>
                            <label>{Strings.categories.searchCategories}</label>
                            <input
                                type="text"
                                placeholder="Search Categories..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className='form-control'
                            />
                        </div>
                        <div className='category-listing'>
                            {categories
                                .filter(item => {
                                    const isMatchingCategory = filterCategory === 'All' || (item && item?.categoryName?.toLowerCase() === filterCategory?.toLowerCase());
                                    const isMatchingSearchTerm =
                                        searchTerm === '' ||
                                        (item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        (item && item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
                                    return isMatchingCategory && isMatchingSearchTerm;
                                })
                                .map((item, index) => (
                                    <CategoryTiles
                                        key={index}
                                        title={item && item.name}
                                        onClick={() => handleTile(item && item.redirect)}
                                        tilesIcon={item && item.IconComponent}
                                        categoryAlt={item && item.name}
                                        description={item && item.description}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default Categories;