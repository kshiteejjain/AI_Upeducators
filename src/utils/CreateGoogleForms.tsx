import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gapi } from 'gapi-script';
import Loader from '../components/loader/Loader';
import formIcon from '../assets/form.svg'

const DISCOVERY_DOCS = ["https://forms.googleapis.com/$discovery/rest?version=v1"];

const CreateGoogleForms = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [formId, setFormId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionsData, setQuestionsData] = useState(['']);

  // Fetch JSON data from Redux store
  const generatedData = useSelector((state) => state?.generatorData?.messages[0]?.content);
  // const questionsData = JSON.parse(generatedData)?.questions;


  function processText(inputText: string) {
    // Define the keywords or phrases to search for
    const searchKeywords = ['Format2'];
  
    // Create a regular expression to match any of the keywords or phrases
    const regex = new RegExp(searchKeywords.join('|'), 'i');
  
    // Find the position of the first match
    const format2Position = inputText.search(regex);
  
    if (format2Position === -1) {
      console.error('None of the specified strings were found.');
      return;
    }
  
    // Extract the part of the text after the matched position
    let jsonText = inputText.substring(format2Position + searchKeywords[0].length).trim();
  
    // Clean the JSON string minimally to ensure proper format
    let cleanedJsonText = jsonText
      .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
      .replace(/(\r\n|\n|\r)/gm, '') // Remove newlines and carriage returns
      .trim();
  
    try {
      // Parse the JSON text into a JavaScript object
      const jsonObject = JSON.parse(cleanedJsonText);
      // Set questions data from the parsed JSON object
      setQuestionsData(jsonObject.questions);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  }
  

  useEffect(() => {
    processText(generatedData)
    function start() {
      gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_FORM_API_KEY,
        clientId: import.meta.env.VITE_GOOGLE_FORM_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: import.meta.env.VITE_GOOGLE_FORM_SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.isSignedIn.listen(onAuthChange);
        onAuthChange(authInstance.isSignedIn.get());
      }).catch((err) => {
        console.error('Error initializing Google API client:', err);
        setError('Failed to initialize Google API client.');
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      const authInstance = gapi.auth2.getAuthInstance();
      const token = authInstance.currentUser.get().getAuthResponse().access_token;
      setAuthToken(token);
    }
    setIsAuthenticated(isSignedIn);
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      console.log('Successfully signed in');
    }).catch(err => {
      alert('Error during sign-in:', err);
      setError('Sign-in failed. Please try again.');
    });
  };

  // const handleSignOut = () => {
  //   gapi.auth2.getAuthInstance().signOut();
  // };

  // console.log('questionsData', questionsData.map(item => item.options.map(subitem => subitem.option)))

  const createForm = async () => {
    try {
      setIsLoading(true);
      if (!authToken) {
        throw new Error('No OAuth token available');
      }

      // Create the form
      const formResponse = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          info: {
            title: 'Your Form'
          }
        }),
      });

      if (!formResponse.ok) {
        const errorData = await formResponse.json();
        console.error('Error creating form:', errorData);
        throw new Error(`Failed to create form: ${errorData.error.message}`);
      }

      const formData = await formResponse.json();
      const newFormId = formData.formId;
      setFormId(newFormId);

      // Update the form with additional items
      const updateResponse = await fetch(`https://forms.googleapis.com/v1/forms/${newFormId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: questionsData?.map((item, index) => ({
            createItem: {
              item: {
                title: item.question,
                questionItem: {
                  question: {
                    choiceQuestion: {
                      type: item.type === 'dropdown' ? 'DROP_DOWN' : 'RADIO', // Adjust based on valid types
                      // type: 'RADIO',
                      options: Array.from(new Set(item?.options?.map(subitem => subitem?.option))).map(option => ({ value: option })),
                    },
                  },
                },
              },
              location: {
                index: index, // Adjust if necessary
              },
            },
          })),
        }),
      });


      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error('Error updating form:', errorData);
        throw new Error(`Failed to update form: ${errorData.error.message}`);
      }

      console.log('Form updated successfully');
      setIsLoading(false);
    } catch (err) {
      console.error('Error creating form or updating items:', err);
      setError(`Failed to create form or update items: ${err.message}`);
    }
  };

  return (
    <>
      {isLoading && <Loader isSwipeText />}
      {isAuthenticated ? (
        <>
          {/* <span onClick={handleSignOut}>Sign Out</span> */}
          <span onClick={createForm}><img src={formIcon} /> Create Form and Add Items</span>
          {/* {formId && <p>Form created with ID: {formId}</p>} */}
          {/* {error && <p>Error: {error}</p>} */}
        </>
      ) : (
        <span onClick={handleSignIn}> <img src={formIcon} /> Create Google Forms</span>
      )}
    </>
  );
};

export default CreateGoogleForms;
