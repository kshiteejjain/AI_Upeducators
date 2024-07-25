import { setMessages, isFollowUpPrompt, resetGeneratedData } from '../features/promptListGeneratorSlice/ClaudeQuestionGeneratorSlice';
export const sendPrompt = (dispatch, props) => {
  dispatch(isFollowUpPrompt(props.isFollowUpPrompt))
  const { messages, generatorPrompt, promptMessage } = props;
  if (localStorage.getItem('username') === 'ankushb@upeducators.com') {
   alert('prompts alert => ' + JSON.stringify(props.promptMessage))
  }
  const prompt = [...(messages || []), { role: 'user', content: promptMessage, isVisible: props.isFollowUpPrompt }];
  
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