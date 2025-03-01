import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NotionBlock from './NotionBlock';

interface NotionEditorProps {
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
}

const NotionEditor: React.FC<NotionEditorProps> = ({ 
  placeholder = 'Type something...',
  initialValue = '',
  onChange 
}) => {
  const [content, setContent] = useState(initialValue);

  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content, onChange]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = (e.target as HTMLDivElement).textContent || '';
    setContent(newContent);
  };

  return (
    <NotionBlock>
      <div
        contentEditable
        className="outline-none w-full min-h-[100px] p-2"
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        placeholder={placeholder}
      />
    </NotionBlock>
  );
};

export default NotionEditor; 