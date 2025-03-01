import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Type, ListOrdered, CheckSquare, Image, Calendar, Clock } from 'lucide-react';

type BlockType = 'text' | 'heading1' | 'heading2' | 'heading3' | 'bullet-list' | 'numbered-list' | 'todo' | 'image' | 'calendar' | 'time';

interface NotionBlockProps {
  children?: React.ReactNode;
  className?: string;
}

const NotionBlock: React.FC<NotionBlockProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`notion-block p-2 my-1 rounded-md hover:bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};

export default NotionBlock; 