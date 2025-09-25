import React from 'react';
import { X, BarChart3 } from 'lucide-react';

export const ComparisonBar = ({ 
  items, 
  onRemove, 
  onCompare 
}) => {
  const selectedItems = items.filter(item => item.selected);
  
  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:pl-64 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              비교 {selectedItems.length}/3
            </span>
          </div>
          <div className="flex space-x-2">
            {selectedItems.map(item => (
              <div key={item.model.id} className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                <span className="truncate max-w-24">{item.model.name}</span>
                <button
                  onClick={() => onRemove(item.model.id)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onCompare}
          disabled={selectedItems.length < 2}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
        >
          비교하기
        </button>
      </div>
    </div>
  );
};