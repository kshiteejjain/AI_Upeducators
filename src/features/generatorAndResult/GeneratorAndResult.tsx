import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/header/Header';

const GeneratorAndResult = () => {
    
    const pathName = useSelector((state) => state.selectedCategory?.selectedCategory);
    const EmailContentGenerator = React.lazy(() => import(`../promptsList/${pathName}.tsx`));
    const Generator = pathName ? EmailContentGenerator : <p>Something went wrong</p>;

    const Result = React.lazy(() => import('../resultSection/Result'));

    return (
        <>
            <Header />
            <div className='page-wrapper'>
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
