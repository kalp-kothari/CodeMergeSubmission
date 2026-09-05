import React, { useState, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import type { Team } from '../../types';

interface TeamSelectorProps {
  teams: Team[];
  value: string;
  onChange: (teamId: string) => void;
  error?: string;
}

export function TeamSelector({ teams, value, onChange, error }: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTeams = teams.filter((t) =>
    t.teamName.toLowerCase().includes(search.toLowerCase())
  );
  
  const selectedTeam = teams.find((t) => t.id === value);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-300 mb-1">Select Team</label>
      <div 
        className={`flex items-center w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 cursor-text focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent`}
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          className="bg-transparent border-none outline-none text-gray-100 w-full placeholder-gray-500"
          placeholder={selectedTeam ? selectedTeam.teamName : "Search team name..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredTeams.length === 0 ? (
            <div className="p-3 text-sm text-gray-400">No teams found.</div>
          ) : (
            <ul className="py-1">
              {filteredTeams.map((team) => (
                <li
                  key={team.id}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 flex justify-between items-center ${value === team.id ? 'bg-gray-700/50 text-brand-400' : 'text-gray-200'}`}
                  onClick={() => {
                    onChange(team.id);
                    setSearch('');
                    setIsOpen(false);
                  }}
                >
                  {team.teamName}
                  {value === team.id && <Check className="w-4 h-4 text-brand-500" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
