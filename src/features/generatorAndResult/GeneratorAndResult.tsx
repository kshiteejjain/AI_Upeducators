import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Button from '../../components/buttons/Button';
import { resetGeneratedData } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import examplerData from '../../utils/exampler.json'
import Close from '../../assets/close.svg'
import Loader from '../../components/loader/Loader';

type Props = {
    formName?: string
    key?: string
    formFields: { [key: string]: string };
    selectedCategory?: string
}

const GeneratorAndResult = () => {
    const [showExampler, setShowExampler] = useState<Props[]>([])
    const pathName = useSelector((state) => state?.selectedCategory?.selectedCategory);
    const EmailContentGenerator = React.lazy(() => import(`../promptsList/${pathName}.tsx`));
    const Generator = pathName ? EmailContentGenerator : <p>Something went wrong</p>;
    const Result = React.lazy(() => import('../resultSection/Result'));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleBack = () => {
        navigate(-1);
        dispatch(resetGeneratedData())
    };
    useEffect(() => {
    }, [navigate]);

    const handleExampler = () => {
        const getFormExampler = examplerData.filter(item => item.formName === pathName);
        setShowExampler(getFormExampler);
    }

    return (
        <>
            <Header />
            <div className='page-wrapper'>
                <div className='backButton'>
                    <div className='container'>
                        <Button isSecondary title="Go Back" type="button" onClick={handleBack} />
                        <Button isSecondary title="Exampler" type="button" onClick={handleExampler} />
                    </div>
                    {showExampler.map((item, index) => {
                        return (
                            <div className='card-popup' key={index}>
                                <div className='card-popup-content'>
                                    <h1>{item.formName.replace(/([a-z])([A-Z])/g, '$1 $2')}</h1>
                                    <img src={Close} onClick={() => setShowExampler([])} className='close' />
                                    <ul>
                                    {Object.keys(item?.formFields).map((key, index) => (
                                        <li key={index}>
                                        <strong>{key}</strong> <span dangerouslySetInnerHTML={{ __html: item?.formFields[key].replace(/(^[^:]+):/gm, '<strong>$1:</strong>').replace(/\n\n/g, '<br /><br />').replace(/\n/g, '<br />').replace(/\./g, '.<br />') }} />
                                        </li>
                                    ))}
                                    </ul>

                                </div>
                                <div className='overlay' onClick={() => setShowExampler([])}></div>
                            </div>
                        )
                    })}
                </div>
                <div className='container'>
                    <Suspense fallback={<Loader />}>
                        {Generator && <Generator />}
                        {Result && <Result />}
                    </Suspense>
                </div>
            </div>
        </>
    );
};
export default GeneratorAndResult;
