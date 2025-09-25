import React, { useState, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import { FilterBar } from '../components/market/FilterBar';
import { ModelCard } from '../components/market/ModelCard';
import { ComparisonBar } from '../components/market/ComparisonBar';
import { ComparisonOverlay } from '../components/market/ComparisonOverlay';
import { mockModels } from '../utils/mockData';

export const Market = () => {
  const [filters, setFilters] = useState({
    search: '',
    modality: [],
    license: [],
    priceRange: [0, 1000],
    minPerformance: 0
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [comparison, setComparison] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const filteredModels = useMemo(() => {
    return mockModels.filter(model => {
      if (filters.search && !model.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !model.creator.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.modality.length > 0 && !filters.modality.includes(model.modality)) {
        return false;
      }
      if (filters.license.length > 0 && !filters.license.includes(model.license)) {
        return false;
      }
      if (model.pricing.type === 'paid' && model.pricing.amount > filters.priceRange[1]) {
        return false;
      }
      const maxMetric = Math.max(...Object.values(model.metrics));
      if (maxMetric < filters.minPerformance) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const handleAddToComparison = (model) => {
    const existingIndex = comparison.findIndex(item => item.model.id === model.id);
    if (existingIndex >= 0) {
      setComparison(comparison.filter(item => item.model.id !== model.id));
    } else if (comparison.filter(item => item.selected).length < 3) {
      setComparison([...comparison, { model, selected: true }]);
    }
  };

  const handleRemoveFromComparison = (modelId) => {
    setComparison(comparison.filter(item => item.model.id !== modelId));
  };

  const isModelInComparison = (modelId) => {
    return comparison.some(item => item.model.id === modelId && item.selected);
  };

  const handleCompare = () => {
    setShowComparison(true);
  };

  return (
    <div className="flex-1">
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        showAdvanced={showAdvanced}
      />

      <div className="flex">
        {/* Advanced Filters Sidebar */}
        {showAdvanced && (
          <div className="w-80 bg-white border-r border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">상세 필터</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  모델 크기
                </label>
                <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option>전체</option>
                  <option>7B 미만</option>
                  <option>7B-13B</option>
                  <option>13B-70B</option>
                  <option>70B 이상</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  포맷
                </label>
                <div className="space-y-2">
                  {['GGUF', 'FP16', 'ONNX'].map(format => (
                    <label key={format} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  스토리지
                </label>
                <div className="space-y-2">
                  {['IPFS', 'Arweave'].map(storage => (
                    <label key={storage} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">{storage}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  호환 GPU
                </label>
                <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option>전체</option>
                  <option>RTX 3090</option>
                  <option>RTX 4090</option>
                  <option>A100</option>
                  <option>H100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  데이터셋 기준 성능
                </label>
                <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option>전체</option>
                  <option>MMLU 기준</option>
                  <option>HellaSwag 기준</option>
                  <option>ARC 기준</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">AI 모델 마켓</h1>
            <p className="text-gray-600 mt-1">{filteredModels.length}개의 모델이 있습니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
            {filteredModels.map(model => (
              <ModelCard
                key={model.id}
                model={model}
                onAddToComparison={handleAddToComparison}
                isComparing={isModelInComparison(model.id)}
              />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-4">조건에 맞는 모델이 없습니다</p>
              <button
                onClick={() => setFilters({
                  search: '',
                  modality: [],
                  license: [],
                  priceRange: [0, 1000],
                  minPerformance: 0
                })}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </div>

      <ComparisonBar
        items={comparison}
        onRemove={handleRemoveFromComparison}
        onCompare={handleCompare}
      />

      {showComparison && (
        <ComparisonOverlay
          models={comparison.filter(item => item.selected).map(item => item.model)}
          onClose={() => setShowComparison(false)}
          onRemove={handleRemoveFromComparison}
        />
      )}
    </div>
  );
};