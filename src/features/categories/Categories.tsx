import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryTiles from '../../components/categoryTiles/CategoryTiles';
import Header from '../../components/header/Header';
import CategoriesAPI from "../../localization/categories.json";
import CategoriesFilter from '../categoriesFilter/CategoriesFilter';

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
    const navigate = useNavigate();

    const getIconPath = async (iconPath: string) => {
        try {
            const iconModule = await import(`../../assets/${iconPath}.svg`);
            return iconModule.default;
        } catch (error) {
            console.error(`Error loading icon ${iconPath}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const formattedCategories = await Promise.all(
                    CategoriesAPI.forms.map(async (item) => ({
                        name: item.name,
                        description: item.description,
                        iconPath: item.iconPath,
                        redirect: item.redirect,
                        IconComponent: await getIconPath(item.iconPath),
                    }))
                );
                setCategories(formattedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, []);

    const handleTile = (redirect?: string) => {
        if (redirect) {
            localStorage.setItem('redirectTo', redirect)
            navigate('/GeneratorAndResult');
            console.log(redirect);
        }
    };

    return (
        <>
            <Header />
            <div className='page-wrapper'>
                <div className='container'>
                    <CategoriesFilter />
                    <div className='category-listing'>
                        {categories.map((item, index) => (
                            <CategoryTiles key={index} title={item.name}
                                onClick={() => handleTile(item.redirect)}
                                tilesIcon={item.IconComponent}
                                description={item.description} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
};

export default Categories;