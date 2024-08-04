import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetGeneratedData } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import { setCategory } from './CategoriesSlice';
import CategoryTiles from '../../components/categoryTiles/CategoryTiles';
import Header from '../../components/header/Header';
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
    }, [filterCategory]);

    const categoryQuery = Math.random().toString(36).slice(8)
    const handleTile = (redirect?: string, name?: string) => {
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
        if (selectedCategory === 'Bookmarked') {
            setBookmarkedOnly(true);
        } else {
            setBookmarkedOnly(false);
            setFilterCategory(selectedCategory);
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

    const selectedGrade = JSON.parse(localStorage.getItem('upEdu_prefix'))?.gradeLevel || '';
    const selectedSubject = JSON.parse(localStorage.getItem('upEdu_prefix'))?.subject || '';
    const selectedChapter = JSON.parse(localStorage.getItem('upEdu_prefix'))?.chapter || '';


    const getSubjectsForGrade = (grade: string) => {
        const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === grade);
        return selectedGrade ? Object.keys(selectedGrade.Subjects) : [];
    };

    const getChaptersForSubject = (grade: string, subject: string) => {
        const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === grade);
        if (selectedGrade && selectedGrade.Subjects[subject]) {
            return selectedGrade.Subjects[subject].Chapters.map(chapter => ({
                name: chapter.name,
                description: chapter.description
            }));
        }
        return [];
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
                            :
                            null
                        }

                        <div className='category-listing'>
                            {categories.length === 0 ? (
                                <>
                                    {[...Array(12)].map((_, index) => (
                                        <ContentLoader key={index} />
                                    ))}
                                </>
                            ) : (
                                categories
                                    .filter(item => {
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
                                    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
                                    .map((item, index) => (
                                        <CategoryTiles
                                            key={index}
                                            id={item && item.id}
                                            title={item && item.name}
                                            onClick={() => handleTile(item && item.redirect, item.name)}
                                            tilesIcon={item && item.IconComponent}
                                            categoryAlt={item && item.name}
                                            description={item && item.description}
                                            thumbnailPath={item && `/assets/${item?.name?.replace(/\s+/g, '-')}.svg`}
                                            bookmarkedIds={bookmarkedIds}
                                            isPaid={item && item.isPaid}
                                        />
                                    ))
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
};
export default Categories;