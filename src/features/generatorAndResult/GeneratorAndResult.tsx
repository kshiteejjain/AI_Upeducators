import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/header/Header';

const GeneratorAndResult = () => {
    
    const pathName = useSelector((state) => state.selectedCategory?.selectedCategory);
    console.log('pathName redux', pathName)

    const Generator = pathName ? lazy(() => import(`../promptsList/${pathName}`)): <p>Something went wrong</p>;

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
