import React from 'react';

interface FilterChipsProps {
  items: string[];
  selectedItem: string | null;
  onSelectItem: (item: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ items, selectedItem, onSelectItem }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-3 -mx-4 px-4">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelectItem(item)}
          className={`
            px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out
            transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400
            ${selectedItem === item
              ? 'bg-cyan-500 text-white shadow-lg -translate-y-1'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:-translate-y-0.5'
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;
