import React from 'react';

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
          CodeMerge V2.0
        </h1>
      </div>
    </header>
  );
}
