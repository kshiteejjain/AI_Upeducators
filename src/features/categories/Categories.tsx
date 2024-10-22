import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetGeneratedData } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import { setCategory } from './CategoriesSlice';
import CategoryTiles from '../../components/categoryTiles/CategoryTiles';
import Header from '../../components/header/Header';
import Button from '../../components/buttons/Button';
import { fetchAllForms } from '../../utils/firebaseUtils';
import CategoriesFilter from '../categoriesFilter/CategoriesFilter';
import CBSEJSON from '../../utils/boardWiseForms.json'
import Strings from '../../utils/en';
import BannerCarousel from '../../components/bannerCarousel/bannerCarousel';
import ContentLoader from '../../components/ContentLoader/ContentLoader';
import BoardFormComponent from '../../features/promptsList/BoardFormComponent';

import './Categories.css';

type Props = {
    id: number;
    name: string;
    description: string;
    iconPath: string;
    IconComponent: string;
    redirect?: string;
    usageCount?: number;
    categoryName?: string;
    onClick?: () => void;
    isBookmarked: boolean | 0;
    isActive: boolean;
    isPaid: boolean
};
const Categories = () => {
    const [categories, setCategories] = useState<Props[]>([]);
    const [filterCategory, setFilterCategory] = useState(() => {
        return localStorage.getItem('filterCategory') || 'All';
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [formData, setFormData] = useState({
        gradeLevel: localStorage.getItem('gradeLevel') || '',
        subject: localStorage.getItem('subject') || '',
        chapter: localStorage.getItem('chapter') || '',
    });
    const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
    const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

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
                    categoryName: category?.categoryName.split(',')[0].trim(),
                    description: category?.description,
                    id: category?.id,
                    redirect: category?.redirect,
                    isBookmarked: category?.isBookmarked,
                    usageCount: category?.usageCount,
                    isActive: category?.isActive,
                    isPaid: category?.isPaid
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

        // Remove isMindmap from localStorage on component load
        const existingData = localStorage.getItem('upEdu_prefix');
        if (existingData) {
            const data = JSON.parse(existingData);
            delete data.isMindmap;  // Remove isMindmap if it exists
            localStorage.setItem('upEdu_prefix', JSON.stringify(data)); // Save back
        }

    }, [filterCategory]);

    const categoryQuery = Math.random().toString(36).slice(8)
    const handleTile = (redirect?: string) => {
        const formData = JSON.parse(localStorage.getItem('upEdu_prefix') || '{}');
        if (localStorage.getItem('filterCategory') === 'CBSE Board') {
            const { gradeLevel, subject, chapter } = formData;

            // If any required field is missing, don't redirect
            if (!gradeLevel || !subject || !chapter) {
                alert('Please select all required fields before proceeding.');
                return;
            }
        }
        if (redirect) {
            dispatch(setCategory(redirect));
            navigate(`/GeneratorAndResult/${redirect}`);

            // Retrieve the existing object from localStorage
            let existingData = localStorage.getItem('upEdu_prefix');
            let data = existingData ? JSON.parse(existingData) : {};
            data.catId = categoryQuery;
            let updatedData = JSON.stringify(data);
            localStorage.setItem('upEdu_prefix', updatedData);
        }
    };

    const handleCategorySelect = (selectedCategory: string) => {
        setSelectedCategory(selectedCategory); // Update selected category
        if (selectedCategory === 'Bookmarked') {
            setBookmarkedOnly(true);
        } else {
            setBookmarkedOnly(false);
            setFilterCategory(selectedCategory);
            setShowAllCategories({}); // Reset the view more state when a category is selected
        }
    };
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setBookmarkedOnly(false);
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
        setFilterCategory(prev => (prev === 'CBSE Board' ? 'All' : 'CBSE Board'))
    }
    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            const updatedFormData = {
                ...prevFormData,
                [name]: value,
            };
            if (name === 'chapter') {
                const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === formData.gradeLevel);
                if (selectedGrade && selectedGrade.Subjects[formData.subject]) {
                    const selectedChapter = selectedGrade.Subjects[formData.subject].Chapters.find((chapter: string) => chapter?.name === value);
                    if (selectedChapter) {
                        updatedFormData.chapterDescription = selectedChapter.description;
                        localStorage.setItem('upEdu_prefix', JSON.stringify(updatedFormData));
                    }
                }
            } else {
                localStorage.setItem('upEdu_prefix', JSON.stringify(updatedFormData));
            }

            return updatedFormData;
        });
    };

    const groupByCategory = (categories) => {
        return Object.groupBy(categories, (item) => item.categoryName);
    };

    const groupedCategories = groupByCategory(categories);

    const handleReadMore = (categoryName: string) => {
        setShowAllCategories(prev => ({
            ...prev,
            [categoryName]: true
        }));
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
                                <button className={localStorage.getItem('filterCategory') === 'CBSE Board' ? 'active' : ''} onClick={handleBoardForms}> {Strings.categories.searchCategories} </button>
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
                                    autoFocus
                                />
                            </div>
                        </div>

                        {localStorage.getItem('filterCategory') === 'CBSE Board' ?
                            <BoardFormComponent
                                gradeLevel={formData.gradeLevel}
                                subject={formData.subject}
                                chapter={formData.chapter}
                                onInputChange={handleInputChange}
                            />
                            : null
                        }

                        <div className='category-listing'>
                            {categories.length === 0 ? (
                                <>
                                    {[...Array(12)].map((_, index) => (
                                        <ContentLoader key={index} />
                                    ))}
                                </>
                            ) : (
                                Object.entries(groupedCategories).map(([categoryName, items]) => {
                                    const isCategoryVisible = items.some(item => {
                                        const isBookmarked = bookmarkedOnly ? bookmarkedIds.includes(item.id) : true;
                                        const isActive = item.isActive === true;
                                        const isMatchingSearchTerm =
                                            isSearchFocused && searchTerm === '' ||
                                            (!isSearchFocused && searchTerm === '') ||
                                            (item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                        const isMatchingCategory = filterCategory === 'All' || (item && item?.categoryName?.toLowerCase().split(',').map(cat => cat.trim()).includes(filterCategory?.toLowerCase()));
                                        return isActive && isBookmarked && isMatchingCategory && isMatchingSearchTerm;
                                    });

                                    // Only render the category group if it's visible
                                    if (!isCategoryVisible) return null;

                                    return (
                                        <div className='category-group' key={categoryName}>
                                            <h3 className="category-header">{categoryName} ({items.length})</h3>
                                            <div className='category-tiles'>
                                                {items
                                                    .filter((item: any) => {
                                                        const isBookmarked = bookmarkedOnly ? bookmarkedIds.includes(item.id) : true;
                                                        const isActive = item.isActive === true;
                                                        const isMatchingSearchTerm =
                                                            isSearchFocused && searchTerm === '' ||
                                                            (!isSearchFocused && searchTerm === '') ||
                                                            (item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                                        if (bookmarkedOnly) {
                                                            return isBookmarked && isMatchingSearchTerm;
                                                        } else {
                                                            const isMatchingCategory = filterCategory === 'All' || (item && item?.categoryName?.toLowerCase().split(',').map(cat => cat.trim()).includes(filterCategory?.toLowerCase()));
                                                            return isActive && isBookmarked && isMatchingCategory && isMatchingSearchTerm;
                                                        }
                                                    })
                                                    .sort((a: number, b: number) => (b.usageCount || 0) - (a.usageCount || 0))
                                                    .slice(0, selectedCategory === categoryName ? items.length : (showAllCategories[categoryName] ? items.length : 3))
                                                    .map((item: string, index: number) => (
                                                        <CategoryTiles
                                                            key={index}
                                                            id={item.id}
                                                            title={item.name}
                                                            onClick={() => handleTile(item.redirect, item.name)}
                                                            tilesIcon={item.IconComponent}
                                                            categoryAlt={item.name}
                                                            description={item.description}
                                                            thumbnailPath={`/assets/${item.name.replace(/\s+/g, '-')}.svg`}
                                                            bookmarkedIds={bookmarkedIds}
                                                            isPaid={item.isPaid}
                                                        />
                                                    ))}

                                                {!(selectedCategory === categoryName) && !showAllCategories[categoryName] && items.length > 3 && (
                                                    <Button title="View More" isSecondary type="button" onClick={() => handleReadMore(categoryName)} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Categories;