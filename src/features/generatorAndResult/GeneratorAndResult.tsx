import React, { Suspense } from 'react';
import Header from '../../components/header/Header';

const GeneratorAndResult = () => {
    const pathName = localStorage.getItem('redirectTo');

    let Generator;
    if (pathName) {
        Generator = React.lazy(() => import(`../promptsList/${pathName}`));
    } else {
        Generator = null; // Set a default value or handle the case where pathName is not set
    }

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
