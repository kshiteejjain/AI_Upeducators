// Toast component
import { useEffect, useState } from 'react';
import CopyClipboard from '../../assets/copyClipboard.svg';

import './Toast.css';

type Props = {
  title?: string;
  isVisible?: boolean;
  timeout?: number;
}

const Toast = ({ title, isVisible, timeout = 5000 }: Props) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, timeout]);

  return isVisible && !isHidden ? (
    <div className="toast">
      <img src={CopyClipboard} className='icon' alt="Copy to Clipboard" />
      <h2>{title}</h2>
    </div>
  ) : null;
};

export default Toast;
