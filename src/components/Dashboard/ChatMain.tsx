import React from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { FilterDisplay } from './FilterDisplay';

export const ChatMain: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: 'var(--tertiary-bg)' }}>
      <ChatMessages />
      <div className="border-t bg-white shadow-sm flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
        <div className="p-4 space-y-4">
          <FilterDisplay />
          <ChatInput />
        </div>
      </div>
    </div>
  );
};