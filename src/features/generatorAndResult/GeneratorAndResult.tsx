import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Button from '../../components/buttons/Button';
import { resetGeneratedData } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import BannerCarousel from '../../components/bannerCarousel/bannerCarousel';

const GeneratorAndResult = () => {
    const pathName = useSelector((state) => state?.selectedCategory?.selectedCategory);
    const EmailContentGenerator = React.lazy(() => import(`../promptsList/${pathName}.tsx`));
    const Generator = pathName ? EmailContentGenerator : <p>Something went wrong</p>;
    const Result = React.lazy(() => import('../resultSection/Result'));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const goBack = () => {
        navigate(-1); // Navigate back to the previous page
        dispatch(resetGeneratedData())
    };
    useEffect(() => {
        // use goBack here if needed within useEffect
    }, [navigate]);
    return (
        <>
            <Header />
            <div className='page-wrapper'>
                <BannerCarousel />
                <div className='backButton'>
                    <div className='container'>
                        <Button isSecondary title="Go Back" type="button" onClick={goBack} />
                    </div>
                </div>
                <div className='container'>
                    <Suspense fallback={<div>Loading</div>}>
                        {Generator && <Generator />}
                        {Result && <Result />}
                    </Suspense>
                </div>
            </div>
        </>
    );
};
export default GeneratorAndResult;
