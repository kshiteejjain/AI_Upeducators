import { setMessages, isFollowUpPrompt, resetGeneratedData } from '../features/promptListGeneratorSlice/QuestionGeneratorSlice';

//Fetching Preferred Output Language
const fetchLanguage = localStorage.getItem('upEdu_prefix');
const data = fetchLanguage ? JSON.parse(fetchLanguage) : { lang: '' }; // Provide a default object if parsing fails or fetchLanguage is null
const selectedLanguage = data.lang || '';

export const sendPrompt = (dispatch: any, props: any) => {
  dispatch(isFollowUpPrompt(props.isFollowUpPrompt))
  const { messages, generatorPrompt, promptMessage } = props;
  if (localStorage.getItem('username') === 'ankushb@upeducators.com') {
   alert('prompts alert => ' + JSON.stringify(props.promptMessage))
  }
  const prompt = [...(messages || []), { role: 'user', content: selectedLanguage === 'hindi' ? promptMessage  + ' Generate output in hindi' : promptMessage, isVisible: props.isFollowUpPrompt }];
  
  dispatch(setMessages(prompt));
  try {
    if (props.isFollowUpPrompt === undefined) {
      // If undefined, call resetGeneratedData and then generatorPrompt
      dispatch(resetGeneratedData(prompt));
      dispatch(generatorPrompt(prompt));
    } else {
      dispatch(generatorPrompt(prompt));
    }
  } catch (error) {
    alert(`Error dispatching generatorPrompt:, ${error}`);
  }
  return null; // or any other rendering
};