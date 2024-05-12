import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, serverTimestamp, getFirestore, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import Header from '../../components/header/Header';
import Loader from '../../components/loader/Loader';
import Button from '../../components/buttons/Button';

import './OnboardingQuestions.css';

type Props = {
    itemName: () => void;
}


const OnboardingQuestions = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: localStorage.getItem('username') || '',
        mobileCountryCode: "91",
        mobile: "",
        city: "",
        country: "India",
        role: "",
        otherRole: "",
        subjects: [""],
        otherSubject: "",
        board: "",
        organization: "",
    });
    const [isLoader, setIsLoader] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const navigate = useNavigate();

    const handleRemove = (itemName: Props) => {
        setSelectedSubjects(selectedSubjects.filter(item => item !== itemName));
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        if (name === 'subjects') {
            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
            const newSelectedSubjects = new Set([...selectedSubjects, ...selectedOptions])
            setSelectedSubjects(Array.from(newSelectedSubjects));
            setFormData(prevState => ({
                ...prevState,
                subjects: Array.from(newSelectedSubjects)
            }));
        } else if (name === 'role' && value === 'Other') {
            setFormData(prevState => ({
                ...prevState,
                role: value,
                otherRole: ''
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    
        // Validation logic
        const formElements = document.querySelectorAll('.form-control');
        let isValid = true;
        formElements.forEach((element) => {
            if (element.required && element.value === '') {
                isValid = false;
            }
        });
    
        if (isValid) {
            // Form is valid, you can allow submission or perform further actions
        } else {
            // Form is invalid, you can prevent submission or display an error message
        }
    };
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoader(true);
        
        // Check if any dropdowns are not selected
        const dropdowns = ['role', 'subjects', 'board'];
        const isValidDropdowns = dropdowns.every(field => formData[field] !== "Please Select" && formData[field] !== "");
    
        if (!isValidDropdowns) {
            // Show error message or prevent form submission
            setIsLoader(false);
            alert("Please select valid options from dropdowns.");
            return;
        }
    
        try {
            const email = formData.email;
            
            const db = getFirestore();
            const onboardingQuestionsCollection = collection(db, 'OnboardingQuestions');
            const q = query(onboardingQuestionsCollection, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            const userDocRef = doc(onboardingQuestionsCollection, email);
    
            if (querySnapshot.empty) {
                await setDoc(userDocRef, {
                    ...formData,
                    user: email,
                    timestamp: serverTimestamp(),
                });
                setIsLoader(false);
                navigate('/Categories');
            } else {
                navigate('/Categories');
            }
        } catch (error) {
            setIsLoader(false);
            console.error("Error adding document: ", error);
        }
    };
    

    return (
        <>
            <Header moreOptions={false} />
            {isLoader && <Loader />}
            <div className='question-container'>
                <div className='question-side onBoardingQuestions'>
                    <h2>Complete Your Profile</h2>
                    <p>You are just one step away from using India's first AI platform for educators.</p>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor='name'>Name<span className='asterisk'>*</span></label>
                            <input
                                required
                                type='text'
                                className='form-control'
                                name='name'
                                placeholder='Enter your name'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='email'>Email<span className='asterisk'>*</span></label>
                            <input
                                required
                                type='email'
                                className='form-control'
                                name='email'
                                placeholder='Enter your email'
                                value={formData.email} 
                                disabled
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='mobile'>Mobile Number<span className='asterisk'>*</span></label>
                            <div className='form-group-flex'>
                                <select name="mobileCountryCode" className='field1 form-control' defaultValue="91" onChange={handleInputChange} >
                                    <optgroup label="Other countries">
                                        <option value="213">(+213)</option>
                                        <option value="376">(+376)</option>
                                        <option value="244">(+244)</option>
                                        <option value="1264">(+1264)</option>
                                        <option value="1268">(+1268)</option>
                                        <option value="54">(+54)</option>
                                        <option value="374">(+374)</option>
                                        <option value="297">(+297)</option>
                                        <option value="61">(+61)</option>
                                        <option value="43">(+43)</option>
                                        <option value="994">(+994)</option>
                                        <option value="1242">(+1242)</option>
                                        <option value="973">(+973)</option>
                                        <option value="880">(+880)</option>
                                        <option value="1246">(+1246)</option>
                                        <option value="375">(+375)</option>
                                        <option value="32">(+32)</option>
                                        <option value="501">(+501)</option>
                                        <option value="229">(+229)</option>
                                        <option value="1441">(+1441)</option>
                                        <option value="975">(+975)</option>
                                        <option value="591">(+591)</option>
                                        <option value="387">(+387)</option>
                                        <option value="267">(+267)</option>
                                        <option value="55">(+55)</option>
                                        <option value="673">(+673)</option>
                                        <option value="359">(+359)</option>
                                        <option value="226">(+226)</option>
                                        <option value="257">(+257)</option>
                                        <option value="855">(+855)</option>
                                        <option value="237">(+237)</option>
                                        <option value="1">(+1)</option>
                                        <option value="238">(+238)</option>
                                        <option value="1345">(+1345)</option>
                                        <option value="236">(+236)</option>
                                        <option value="56">(+56)</option>
                                        <option value="86">(+86)</option>
                                        <option value="57">(+57)</option>
                                        <option value="269">(+269)</option>
                                        <option value="242">(+242)</option>
                                        <option value="682">(+682)</option>
                                        <option value="506">(+506)</option>
                                        <option value="385">(+385)</option>
                                        <option value="53">(+53)</option>
                                        <option value="90392">(+90392)</option>
                                        <option value="357">(+357)</option>
                                        <option value="42">(+42)</option>
                                        <option value="45">(+45)</option>
                                        <option value="253">(+253)</option>
                                        <option value="1809">(+1809)</option>
                                        <option value="1809">(+1809)</option>
                                        <option value="593">(+593)</option>
                                        <option value="20">(+20)</option>
                                        <option value="503">(+503)</option>
                                        <option value="240">(+240)</option>
                                        <option value="291">(+291)</option>
                                        <option value="372">(+372)</option>
                                        <option value="251">(+251)</option>
                                        <option value="500">(+500)</option>
                                        <option value="298">(+298)</option>
                                        <option value="679">(+679)</option>
                                        <option value="358">(+358)</option>
                                        <option value="33">(+33)</option>
                                        <option value="594">(+594)</option>
                                        <option value="689">(+689)</option>
                                        <option value="241">(+241)</option>
                                        <option value="220">(+220)</option>
                                        <option value="7880">(+7880)</option>
                                        <option value="49">(+49)</option>
                                        <option value="233">(+233)</option>
                                        <option value="350">(+350)</option>
                                        <option value="30">(+30)</option>
                                        <option value="299">(+299)</option>
                                        <option value="1473">(+1473)</option>
                                        <option value="590">(+590)</option>
                                        <option value="671">(+671)</option>
                                        <option value="502">(+502)</option>
                                        <option value="224">(+224)</option>
                                        <option value="245">(+245)</option>
                                        <option value="592">(+592)</option>
                                        <option value="509">(+509)</option>
                                        <option value="504">(+504)</option>
                                        <option value="852">(+852)</option>
                                        <option value="36">(+36)</option>
                                        <option value="354">(+354)</option>
                                        <option value="91">(+91)</option>
                                        <option value="62">(+62)</option>
                                        <option value="98">(+98)</option>
                                        <option value="964">(+964)</option>
                                        <option value="353">(+353)</option>
                                        <option value="972">(+972)</option>
                                        <option value="39">(+39)</option>
                                        <option value="1876">(+1876)</option>
                                        <option value="81">(+81)</option>
                                        <option value="962">(+962)</option>
                                        <option value="7">(+7)</option>
                                        <option value="254">(+254)</option>
                                        <option value="686">(+686)</option>
                                        <option value="850">(+850)</option>
                                        <option value="82">(+82)</option>
                                        <option value="965">(+965)</option>
                                        <option value="996">(+996)</option>
                                        <option value="856">(+856)</option>
                                        <option value="371">(+371)</option>
                                        <option value="961">(+961)</option>
                                        <option value="266">(+266)</option>
                                        <option value="231">(+231)</option>
                                        <option value="218">(+218)</option>
                                        <option value="417">(+417)</option>
                                        <option value="370">(+370)</option>
                                        <option value="352">(+352)</option>
                                        <option value="853">(+853)</option>
                                        <option value="389">(+389)</option>
                                        <option value="261">(+261)</option>
                                        <option value="265">(+265)</option>
                                        <option value="60">(+60)</option>
                                        <option value="960">(+960)</option>
                                        <option value="223">(+223)</option>
                                        <option value="356">(+356)</option>
                                        <option value="692">(+692)</option>
                                        <option value="596">(+596)</option>
                                        <option value="222">(+222)</option>
                                        <option value="269">(+269)</option>
                                        <option value="52">(+52)</option>
                                        <option value="691">(+691)</option>
                                        <option value="373">(+373)</option>
                                        <option value="377">(+377)</option>
                                        <option value="976">(+976)</option>
                                        <option value="1664">(+1664)</option>
                                        <option value="212">(+212)</option>
                                        <option value="258">(+258)</option>
                                        <option value="95">(+95)</option>
                                        <option value="264">(+264)</option>
                                        <option value="674">(+674)</option>
                                        <option value="977">(+977)</option>
                                        <option value="31">(+31)</option>
                                        <option value="687">(+687)</option>
                                        <option value="64">(+64)</option>
                                        <option value="505">(+505)</option>
                                        <option value="227">(+227)</option>
                                        <option value="234">(+234)</option>
                                        <option value="683">(+683)</option>
                                        <option value="672">(+672)</option>
                                        <option value="670">(+670)</option>
                                        <option value="47">(+47)</option>
                                        <option value="968">(+968)</option>
                                        <option value="680">(+680)</option>
                                        <option value="507">(+507)</option>
                                        <option value="675">(+675)</option>
                                        <option value="595">(+595)</option>
                                        <option value="51">(+51)</option>
                                        <option value="63">(+63)</option>
                                        <option value="48">(+48)</option>
                                        <option value="351">(+351)</option>
                                        <option value="1787">(+1787)</option>
                                        <option value="974">(+974)</option>
                                        <option value="262">(+262)</option>
                                        <option value="40">(+40)</option>
                                        <option value="7">(+7)</option>
                                        <option value="250">(+250)</option>
                                        <option value="378">(+378)</option>
                                        <option value="239">(+239)</option>
                                        <option value="966">(+966)</option>
                                        <option value="221">(+221)</option>
                                        <option value="381">(+381)</option>
                                        <option value="248">(+248)</option>
                                        <option value="232">(+232)</option>
                                        <option value="65">(+65)</option>
                                        <option value="421">(+421)</option>
                                        <option value="386">(+386)</option>
                                        <option value="677">(+677)</option>
                                        <option value="252">(+252)</option>
                                        <option value="27">(+27)</option>
                                        <option value="34">(+34)</option>
                                        <option value="94">(+94)</option>
                                        <option value="290">(+290)</option>
                                        <option value="1869">(+1869)</option>
                                        <option value="1758">(+1758)</option>
                                        <option value="249">(+249)</option>
                                        <option value="597">(+597)</option>
                                        <option value="268">(+268)</option>
                                        <option value="46">(+46)</option>
                                        <option value="41">(+41)</option>
                                        <option value="963">(+963)</option>
                                        <option value="886">(+886)</option>
                                        <option value="7">(+7)</option>
                                        <option value="66">(+66)</option>
                                        <option value="228">(+228)</option>
                                        <option value="676">(+676)</option>
                                        <option value="1868">(+1868)</option>
                                        <option value="216">(+216)</option>
                                        <option value="90">(+90)</option>
                                        <option value="7">(+7)</option>
                                        <option value="993">(+993)</option>
                                        <option value="1649">(+1649)</option>
                                        <option value="688">(+688)</option>
                                        <option value="256">(+256)</option>
                                        <option value="44">(+44)</option>
                                        <option value="380">(+380)</option>
                                        <option value="971">(+971)</option>
                                        <option value="598">(+598)</option>
                                        <option value="1">(+1)</option>
                                        <option value="7">(+7)</option>
                                        <option value="678">(+678)</option>
                                        <option value="379">(+379)</option>
                                        <option value="58">(+58)</option>
                                        <option value="84">(+84)</option>
                                        <option value="84">(+1284)</option>
                                        <option value="84">(+1340)</option>
                                        <option value="681">(+681)</option>
                                        <option value="969">(+969)</option>
                                        <option value="967">(+967)</option>
                                        <option value="260">(+260)</option>
                                        <option value="263">(+263)</option>

                                    </optgroup>
                                </select>
                                <input
                                    required
                                    type='number'
                                    className='form-control'
                                    name='mobile'
                                    pattern='[0-9]{10,14}'
                                    placeholder='Your Mobile Number'
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='city'>City<span className='asterisk'>*</span></label>
                            <input
                                required
                                type='text'
                                className='form-control'
                                name='city'
                                placeholder='Enter your city'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='country'>Country<span className='asterisk'>*</span></label>
                            <select name="country" className="form-control" defaultValue="India" onChange={handleInputChange}>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="Åland Islands">Åland Islands</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="American Samoa">American Samoa</option>
                                <option value="Andorra">Andorra</option>
                                <option value="Angola">Angola</option>
                                <option value="Anguilla">Anguilla</option>
                                <option value="Antarctica">Antarctica</option>
                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Aruba">Aruba</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahamas">Bahamas</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Barbados">Barbados</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Belize">Belize</option>
                                <option value="Benin">Benin</option>
                                <option value="Bermuda">Bermuda</option>
                                <option value="Bhutan">Bhutan</option>
                                <option value="Bolivia">Bolivia</option>
                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                <option value="Botswana">Botswana</option>
                                <option value="Bouvet Island">Bouvet Island</option>
                                <option value="Brazil">Brazil</option>
                                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                <option value="Brunei Darussalam">Brunei Darussalam</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Burkina Faso">Burkina Faso</option>
                                <option value="Burundi">Burundi</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Cameroon">Cameroon</option>
                                <option value="Canada">Canada</option>
                                <option value="Cape Verde">Cape Verde</option>
                                <option value="Cayman Islands">Cayman Islands</option>
                                <option value="Central African Republic">Central African Republic</option>
                                <option value="Chad">Chad</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Christmas Island">Christmas Island</option>
                                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Comoros">Comoros</option>
                                <option value="Congo">Congo</option>
                                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                <option value="Cook Islands">Cook Islands</option>
                                <option value="Costa Rica">Costa Rica</option>
                                <option value="Cote D'ivoire">Cote D'ivoire</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cuba">Cuba</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Djibouti">Djibouti</option>
                                <option value="Dominica">Dominica</option>
                                <option value="Dominican Republic">Dominican Republic</option>
                                <option value="Ecuador">Ecuador</option>
                                <option value="Egypt">Egypt</option>
                                <option value="El Salvador">El Salvador</option>
                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                <option value="Eritrea">Eritrea</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Ethiopia">Ethiopia</option>
                                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                <option value="Faroe Islands">Faroe Islands</option>
                                <option value="Fiji">Fiji</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="French Guiana">French Guiana</option>
                                <option value="French Polynesia">French Polynesia</option>
                                <option value="French Southern Territories">French Southern Territories</option>
                                <option value="Gabon">Gabon</option>
                                <option value="Gambia">Gambia</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Gibraltar">Gibraltar</option>
                                <option value="Greece">Greece</option>
                                <option value="Greenland">Greenland</option>
                                <option value="Grenada">Grenada</option>
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Guam">Guam</option>
                                <option value="Guatemala">Guatemala</option>
                                <option value="Guernsey">Guernsey</option>
                                <option value="Guinea">Guinea</option>
                                <option value="Guinea-bissau">Guinea-bissau</option>
                                <option value="Guyana">Guyana</option>
                                <option value="Haiti">Haiti</option>
                                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                <option value="Honduras">Honduras</option>
                                <option value="Hong Kong">Hong Kong</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India" defaultValue>India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Isle of Man">Isle of Man</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Jamaica">Jamaica</option>
                                <option value="Japan">Japan</option>
                                <option value="Jersey">Jersey</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kiribati">Kiribati</option>
                                <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                <option value="Korea, Republic of">Korea, Republic of</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lesotho">Lesotho</option>
                                <option value="Liberia">Liberia</option>
                                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Macao">Macao</option>
                                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                <option value="Madagascar">Madagascar</option>
                                <option value="Malawi">Malawi</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Mali">Mali</option>
                                <option value="Malta">Malta</option>
                                <option value="Marshall Islands">Marshall Islands</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Mauritania">Mauritania</option>
                                <option value="Mauritius">Mauritius</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                <option value="Moldova, Republic of">Moldova, Republic of</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Mongolia">Mongolia</option>
                                <option value="Montenegro">Montenegro</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Mozambique">Mozambique</option>
                                <option value="Myanmar">Myanmar</option>
                                <option value="Namibia">Namibia</option>
                                <option value="Nauru">Nauru</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Netherlands Antilles">Netherlands Antilles</option>
                                <option value="New Caledonia">New Caledonia</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nicaragua">Nicaragua</option>
                                <option value="Niger">Niger</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Niue">Niue</option>
                                <option value="Norfolk Island">Norfolk Island</option>
                                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Palau">Palau</option>
                                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                <option value="Panama">Panama</option>
                                <option value="Papua New Guinea">Papua New Guinea</option>
                                <option value="Paraguay">Paraguay</option>
                                <option value="Peru">Peru</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Pitcairn">Pitcairn</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Reunion">Reunion</option>
                                <option value="Romania">Romania</option>
                                <option value="Russian Federation">Russian Federation</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Saint Helena">Saint Helena</option>
                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                <option value="Saint Lucia">Saint Lucia</option>
                                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                <option value="Samoa">Samoa</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Serbia">Serbia</option>
                                <option value="Seychelles">Seychelles</option>
                                <option value="Sierra Leone">Sierra Leone</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="Solomon Islands">Solomon Islands</option>
                                <option value="Somalia">Somalia</option>
                                <option value="South Africa">South Africa</option>
                                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                <option value="Spain">Spain</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Sudan">Sudan</option>
                                <option value="Suriname">Suriname</option>
                                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                <option value="Swaziland">Swaziland</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                <option value="Taiwan">Taiwan</option>
                                <option value="Tajikistan">Tajikistan</option>
                                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Timor-leste">Timor-leste</option>
                                <option value="Togo">Togo</option>
                                <option value="Tokelau">Tokelau</option>
                                <option value="Tonga">Tonga</option>
                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                <option value="Tunisia">Tunisia</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Turkmenistan">Turkmenistan</option>
                                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                <option value="Tuvalu">Tuvalu</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                <option value="Uruguay">Uruguay</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="Vanuatu">Vanuatu</option>
                                <option value="Venezuela">Venezuela</option>
                                <option value="Viet Nam">Viet Nam</option>
                                <option value="Virgin Islands, British">Virgin Islands, British</option>
                                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                <option value="Wallis and Futuna">Wallis and Futuna</option>
                                <option value="Western Sahara">Western Sahara</option>
                                <option value="Yemen">Yemen</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                            </select>
                        </div>

                        <div className='form-group'>
                            <label htmlFor="role">Role<span>*</span></label>
                            <select name="role" onChange={handleInputChange} required className='form-control'>
                                <option>Please Select</option>
                                <option value="Pre-Primary or Primary Teacher">Pre-Primary or Primary Teacher</option>
                                <option value="Teacher for 6th-12th Class">Teacher for 6th-12th Class</option>
                                <option value="Principal/Senior Management">Principal/Senior Management</option>
                                <option value="College Faculty or Professor">College Faculty or Professor</option>
                                <option value="Private Tutor">Private Tutor</option>
                                <option value="Online Educator">Online Educator</option>
                                <option value="Coaching or Institute Owner">Coaching or Institute Owner</option>
                                <option value="Trainer">Trainer</option>
                                <option value="B.Ed. Graduate">B.Ed. Graduate</option>
                                <option value="Not employed">Not employed</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {formData.role === "Other" && (
                            <div className='form-group'>
                                <input type="text" name="otherRole" value={formData.otherRole} onChange={handleInputChange} placeholder="Specify Other Role" className='form-control' />
                            </div>
                        )}

                        <div className='form-group'>

                            <label htmlFor="subjects">Subjects<span>*</span></label>
                            <select name="subjects" onChange={handleInputChange} className='form-control'>
                            <option>Please Select</option>
                                <option value="Elementary">Elementary (all subjects)</option>
                                <option value="Electives">Electives</option>
                                <option value="Art & Music">Art & Music</option>
                                <option value="English / Language Arts">English / Language Arts</option>
                                <option value="Foreign Language">Foreign Language</option>
                                <option value="Special Education">Special Education</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Social Science">Social Science</option>
                                <option value="Technology">Technology</option>
                                <option value="Science">Science</option>
                                <option value="STEM">STEM</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Psychologist / Social worker">Psychologist / Social worker</option>
                                <option value="Counselor">Counselor</option>
                                <option value="Administrator">Administrator</option>
                                <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                                <option value="Other">Other</option>
                            </select>
                            {selectedSubjects.length !== 0 && <div className='selected-subjects'>
                                {selectedSubjects.map((item, index) => (
                                    <span key={index} className='subjects-list'>
                                        <span>{item}</span>
                                        <span className='remove-subject' onClick={() => handleRemove(item)}>x</span>
                                    </span>
                                ))}
                            </div>
                            }
                        </div>
                        {formData.subjects.includes("Other") && (
                            <div className='form-group'>
                                <input type="text" name="otherSubject" value={formData.otherSubject} onChange={handleInputChange} placeholder="Specify Other Subject" className='form-control' />
                            </div>
                        )}

                        <div className='form-group'>
                            <label htmlFor="board">Board<span>*</span></label>
                            <select name="board" required className='form-control' onChange={handleInputChange}>
                            <option>Please Select</option>
                                <option value="CBSE">CBSE</option>
                                <option value="ICSE">ICSE</option>
                                <option value="Cambridge">Cambridge</option>
                                <option value="IB">IB</option>
                                <option value="Not Applicable">Not Applicable</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="organization">Organization Name<span>*</span></label>
                            <input type="text" name="organization" required className='form-control' onChange={handleInputChange} />
                        </div>

                        <Button title={'Complete Profile'} />
                    </form>

                </div>
                <div className='visual-side'>
                    <img src="https://images.pexels.com/photos/4144533/pexels-photo-4144533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Form" />
                </div>
            </div>
        </>
    );
};

export default OnboardingQuestions;
