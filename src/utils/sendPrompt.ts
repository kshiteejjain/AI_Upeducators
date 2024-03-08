import { setMessages, isFollowUpPrompt } from '../features/promptListGeneratorSlice/QuestionGeneratorSlice';
export const sendPrompt = (dispatch, props) => {
  dispatch(isFollowUpPrompt(props.isFollowUpPrompt))
  const { messages, generatorPrompt, promptMessage, isGPT4 } = props;
  const prompt = [...(messages || []), { role: 'user', content: promptMessage, isVisible: props.isFollowUpPrompt }];
  dispatch(setMessages(prompt, isGPT4));
  try {
    dispatch(generatorPrompt({ prompt: promptMessage, isGPT4 }));
  } catch (error) {
    alert('Error dispatching generatorPrompt:', error);
  }
  return null; // or any other rendering
};
