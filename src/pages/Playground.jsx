import React, { useState } from 'react';
import { Send, Settings, Copy, Download, Play, Pause } from 'lucide-react';

export const Playground = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState('general');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [topP, setTopP] = useState(0.9);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.1);

  const presets = [
    { id: 'general', name: '일반 대화', systemPrompt: '도움이 되는 AI 어시스턴트입니다.' },
    { id: 'coding', name: '코딩', systemPrompt: '코딩과 프로그래밍에 특화된 어시스턴트입니다.' },
    { id: 'translation', name: '한-영 번역', systemPrompt: '한국어와 영어 번역 전문가입니다.' },
    { id: 'caption', name: '이미지 캡션', systemPrompt: '이미지를 분석하고 설명하는 전문가입니다.' }
  ];

  const handlePresetChange = (presetId) => {
    setPreset(presetId);
    const selectedPreset = presets.find(p => p.id === presetId);
    if (selectedPreset) {
      setSystemPrompt(selectedPreset.systemPrompt);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(`안녕하세요! "${prompt}"에 대한 응답입니다. 이는 시뮬레이션된 답변으로, 실제 모델의 응답을 보여주는 예시입니다. 

설정된 파라미터:
- 온도: ${temperature}
- 최대 토큰: ${maxTokens}
- 프리셋: ${presets.find(p => p.id === preset)?.name}

실제 환경에서는 선택된 모델이 이 설정에 따라 응답을 생성합니다.`);
      setLoading(false);
    }, 2000);
  };

  const exportToCurl = () => {
    const curlCommand = `curl -X POST "https://api.modelhub.ai/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4-turbo",
    "messages": [
      {"role": "system", "content": "${systemPrompt}"},
      {"role": "user", "content": "${prompt}"}
    ],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens},
    "top_p": ${topP}
  }'`;
    
    navigator.clipboard.writeText(curlCommand);
  };

  const exportToTypeScript = () => {
    const tsCode = `import { ModelHubClient } from '@modelhub/client';

const client = new ModelHubClient({
  apiKey: process.env.MODELHUB_API_KEY
});

const response = await client.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: '${systemPrompt}' },
    { role: 'user', content: '${prompt}' }
  ],
  temperature: ${temperature},
  max_tokens: ${maxTokens},
  top_p: ${topP}
});

console.log(response.choices[0].message.content);`;
    
    navigator.clipboard.writeText(tsCode);
  };

  const estimatedCost = (prompt.length + maxTokens) * 0.00002;

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              {presets.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">저장</button>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">공유</button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>모델: GPT-4 Turbo</span>
            <span>•</span>
            <span>세션: 활성</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Chat Area - 70% */}
        <div className="flex-1 flex flex-col" style={{ width: '70%' }}>
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {response && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-blue-600 font-medium mb-2">사용자</div>
                  <p className="text-gray-900 whitespace-pre-wrap">{prompt}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 font-medium mb-2">GPT-4 Turbo</div>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{response}</p>
                  <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                    <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                      <Copy className="h-4 w-4" />
                      <span>복사</span>
                    </button>
                    <span className="text-xs text-gray-500">응답 시간: 1.2초</span>
                    <span className="text-xs text-gray-500">토큰: 156</span>
                  </div>
                </div>
              </div>
            )}
            {!response && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">메시지를 입력하여 대화를 시작하세요</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? '생성 중...' : '전송'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Settings Sidebar - 30% */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">설정</h3>

          {/* Basic Settings */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                모델
              </label>
              <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                <option>GPT-4 Turbo</option>
                <option>Claude 3 Opus</option>
                <option>Gemini Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 토큰: {maxTokens}
              </label>
              <input
                type="range"
                min="100"
                max="4000"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100</span>
                <span>4000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                온도: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>정확</span>
                <span>창의적</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시스템 프롬프트 (요약)
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="시스템 메시지를 입력하세요..."
                rows={2}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full mt-6 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAdvanced ? '기본 설정만 보기' : '고급 설정 보기'}
          </button>

          {showAdvanced && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top-p: {topP}
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={topP}
                  onChange={(e) => setTopP(Number(e.target.value))}
                  className="w-full accent-blue-600" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  반복 패널티: {repetitionPenalty}
                </label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  value={repetitionPenalty}
                  onChange={(e) => setRepetitionPenalty(Number(e.target.value))}
                  className="w-full accent-blue-600" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  안전 필터
                </label>
                <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option>기본</option>
                  <option>엄격</option>
                  <option>관대</option>
                </select>
              </div>
            </div>
          )}

          {/* Cost/Usage Card */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">비용/쿼터</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>요청 예상 비용:</span>
                <span className="font-medium">${estimatedCost.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>이번 세션:</span>
                <span className="font-medium">$0.15</span>
              </div>
              <div className="flex justify-between">
                <span>월 한도:</span>
                <span className="font-medium">$500 / $1000</span>
              </div>
            </div>
          </div>

          {/* Export Panel */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Export</h4>
            <div className="space-y-2">
              <button
                onClick={exportToCurl}
                className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                cURL로 복사
              </button>
              <button
                onClick={exportToTypeScript}
                className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                JavaScript로 복사
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                Python으로 복사
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};