import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCategory } from './CategoriesSlice';
import { resetGeneratedData } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import CategoryTiles from '../../components/categoryTiles/CategoryTiles';
import Header from '../../components/header/Header';
import { fetchAllForms } from '../../utils/firebaseUtils';
import CategoriesFilter from '../categoriesFilter/CategoriesFilter';
import Strings from '../../utils/en';
import BannerCarousel from '../../components/bannerCarousel/bannerCarousel';
import tick from "../../assets/tick.svg"

import './Categories.css';

type Props = {
    name: string;
    description: string;
    iconPath: string;
    IconComponent: string;
    redirect?: string;
    usageCount?: number;
    onClick?: () => void;
};
const Categories = () => {
    const [categories, setCategories] = useState<Props[]>([]);
    const [filterCategory, setFilterCategory] = useState(() => {
        return localStorage.getItem('filterCategory') || 'All';
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isBoardForms, setIsBoardForms] = useState(false);
    const [formData, setFormData] = useState({
        gradeLevel: localStorage.getItem('gradeLevel') || '',
        subject: localStorage.getItem('subject') || '',
        chapter: localStorage.getItem('chapter') || '',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getIconPath = async (iconPath: string) => {
        try {
            const iconModule = await import(`../../assets/${iconPath}.svg`);
            return iconModule.default;
        } catch (error) {
            alert(`Error loading icon ${iconPath}:, ${error}`);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await fetchAllForms();
                const iconPathsData = await Promise.all(categoryData.map(async (category: Props) => {
                    const path = category.iconPath ? await getIconPath(category.iconPath) : null;
                    return { [category.name]: path };
                }));
                const iconPathsObject = Object.assign({}, ...iconPathsData);
                const formattedCategories = categoryData.map((category: any) => ({
                    name: category?.name,
                    IconComponent: iconPathsObject[category?.name],
                    thumbnailPath: category?.thumbnailPath,
                    categoryName: category?.categoryName,
                    description: category?.description,
                    id: category?.id,
                    redirect: category?.redirect,
                    isBookmarked: category?.isBookmarked,
                    usageCount: category?.usageCount
                }));
                setCategories(formattedCategories);
            } catch (error) {
                console.warn('Error fetching categories:', error);
            }
        };
        fetchData();
        localStorage.setItem('filterCategory', filterCategory);
        setFilterCategory(localStorage.getItem('filterCategory') || 'All');

        //Resetting store data
        dispatch(resetGeneratedData())
    }, [filterCategory]);

    const handleTile = (redirect?: string, name?: string) => {
        localStorage.setItem('curForm', name)
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
    const handleSearchFocus = () => {
        setIsSearchFocused(true);
        setFilterCategory('All');
        setSearchTerm('');
    };

    const handleSearchBlur = () => {
        setIsSearchFocused(false);
    };

    const handleBoardForms = () => {
        setIsBoardForms(prev => !prev)
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Update the formData state and save the new state to localStorage
        setFormData(prevFormData => {
            const updatedFormData = {
                ...prevFormData,
                [name]: value
            };

            // Serialize and save the updated form data to localStorage
            localStorage.setItem('boardFormData', JSON.stringify(updatedFormData));

            return updatedFormData;
        });
    };



    return (
        <>
            <Header />
            <div className='page-wrapper'>
                <BannerCarousel />
                <div className='container'>
                    <CategoriesFilter onSelect={handleCategorySelect} />
                    <div className='category-listing-wrapper'>
                        <div className='additional-filter-parent'>
                            <div className='additional-filters'>
                                <button onClick={handleBoardForms}> {Strings.categories.searchCategories} {isBoardForms && <img src={tick} />} </button>
                            </div>
                            <div className='search-wrapper'>
                                <input
                                    type="search"
                                    placeholder="Type your search..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    onFocus={handleSearchFocus}
                                    onBlur={handleSearchBlur}
                                    className='form-control'
                                />
                            </div>
                        </div>
                        {isBoardForms &&
                            <form className='board-forms-prefix'>
                                <div className='form-group'>
                                    <label htmlFor='gradeLevel'>Grade Level
                                        <span className="asterisk">*</span></label>
                                    <select
                                        required
                                        className='form-control'
                                        name="gradeLevel"
                                        onChange={handleInputChange}
                                        value={formData.gradeLevel}
                                        placeholder="Select the grade level for which the questions are being created">
                                        <option value="">Select the grade</option>
                                        <option value="6th-Grade">6th Grade</option>
                                        <option value="7th-Grade">7th Grade</option>
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='subject'>Subject
                                        <span className="asterisk">*</span></label>
                                    <select
                                        required
                                        className='form-control'
                                        name="subject"
                                        onChange={handleInputChange}
                                        value={formData.subject}
                                        placeholder="Select Subject">
                                        <option value="">Select the subject</option>
                                        <option value="Science">Science</option>
                                        <option value="Mathematics">Mathematics</option>
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='chapter'>Chapter
                                        <span className="asterisk">*</span></label>
                                    <select
                                        required
                                        className='form-control'
                                        name="chapter"
                                        onChange={handleInputChange}
                                        value={formData.chapter}
                                        placeholder="Select the relevant chapter name">
                                        <option value="">Select the chapter</option>
                                        <option value="Chapter 1">Chapter 1</option>
                                        <option value="Chapter 2">Chapter 2</option>
                                        <option value="Chapter 3">Chapter 3</option>
                                        <option value="Chapter 4">Chapter 4</option>
                                        <option value="Chapter 5">Chapter 5</option>
                                    </select>
                                </div>
                            </form>
                        }

                        <div className='category-listing'>
                            {categories
                                .filter(item => {
                                    const isMatchingCategory = filterCategory === 'All' || (item && item?.categoryName?.toLowerCase() === filterCategory?.toLowerCase());
                                    const isMatchingSearchTerm =
                                        isSearchFocused && searchTerm === '' ||
                                        (!isSearchFocused && searchTerm === '') ||
                                        (item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                    return isMatchingCategory && isMatchingSearchTerm;
                                })
                                .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
                                .map((item, index) => (
                                    <CategoryTiles
                                        key={index}
                                        title={item && item.name}
                                        onClick={() => handleTile(item && item.redirect, item.name)}
                                        tilesIcon={item && item.IconComponent}
                                        categoryAlt={item && item.name}
                                        description={item && item.description}
                                        thumbnailPath={item && `/assets/${item?.name?.replace(/\s+/g, '-')}.svg`}
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