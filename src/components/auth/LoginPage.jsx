import React, { useState } from 'react';
import { Bot, Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 실제 환경에서는 백엔드 API 호출
      if (formData.email === 'demo@modelhub.ai' && formData.password === 'demo123') {
        const userData = {
          id: '1',
          name: '데모 사용자',
          email: formData.email,
          avatar: null,
          provider: 'email',
          wallet: { connected: false, address: null, network: null }
        };
        
        const token = 'demo_token_' + Date.now();
        await login(userData, token);
      } else {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // 실제 환경에서는 Google OAuth를 구현하세요
      // 현재는 데모용 Google 로그인 시뮬레이션
      const userData = {
        id: 'google_demo_user',
        name: 'Google 사용자',
        email: 'google.user@gmail.com',
        avatar: null,
        provider: 'google',
        wallet: { connected: false, address: null, network: null }
      };

      const token = 'google_demo_token_' + Date.now();
      await login(userData, token);
    } catch (err) {
      setError('Google 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ModelHub</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
          <p className="text-gray-600">AI 모델 마켓플레이스에 오신 것을 환영합니다</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Google Login */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Google로 계속하기</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">데모 계정</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>이메일 로그인:</strong></p>
              <p>• 이메일: demo@modelhub.ai</p>
              <p>• 비밀번호: demo123</p>
              <p className="pt-2"><strong>Google 로그인:</strong></p>
              <p>• 위의 Google 버튼을 클릭하면 데모 계정으로 로그인됩니다</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <button className="text-sm text-blue-600 hover:text-blue-700">
              비밀번호를 잊으셨나요?
            </button>
            <div className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                회원가입
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>로그인하면 <a href="#" className="text-blue-600 hover:text-blue-700">이용약관</a> 및 <a href="#" className="text-blue-600 hover:text-blue-700">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
    </div>
  );
};