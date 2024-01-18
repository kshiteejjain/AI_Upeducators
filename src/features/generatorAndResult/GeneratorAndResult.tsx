import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetGeneratedData } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Header from '../../components/header/Header';
import Button from '../../components/buttons/Button';

const GeneratorAndResult = () => {
    
    const pathName = useSelector((state) => state?.selectedCategory?.selectedCategory);
    const EmailContentGenerator = React.lazy(() => import(`../promptsList/${pathName}.tsx`));
    const Generator = pathName ? EmailContentGenerator : <p>Something went wrong</p>;

    const Result = React.lazy(() => import('../resultSection/Result'));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Dispatch the action to reset the state on page load
        dispatch(resetGeneratedData());
      }, [dispatch]);
    
      const goBack = () => {
        navigate(-1); // Navigate back to the previous page
      };

    return (
        <>
            <Header />
            <div className='page-wrapper'>
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
