import React, { useState, useEffect } from 'react';
import { Bot, Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = window.location.origin;

export const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // URL에서 인증 코드 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      setError(`Google 로그인 오류: ${error}`);
      // URL에서 오류 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (code && state === 'google_oauth') {
      handleOAuthCallback(code);
      // URL에서 코드 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // 로컬 이메일 로그인 (데모용)
  const handleEmailLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 500));
      await login(
        { id: 'local-demo', email: formData.email, name: formData.email },
        'demo-token'
      );
    } catch {
      setError('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // OAuth2 방식 Google 로그인
  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID가 설정되지 않았습니다.');
      return;
    }

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state: 'google_oauth',
      access_type: 'offline',
      prompt: 'select_account'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    window.location.href = authUrl;
  };

  // OAuth 콜백 처리
  const handleOAuthCallback = async (code) => {
    setLoading(true);
    setError('');

    try {
      // 프론트엔드에서 직접 토큰 교환 (보안상 권장하지 않음, 데모용)
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET, // 실제로는 백엔드에서 처리해야 함
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('토큰 교환 실패');
      }

      const tokenData = await tokenResponse.json();
      const { access_token, id_token } = tokenData;

      // 사용자 정보 가져오기
      const userResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
      );

      if (!userResponse.ok) {
        throw new Error('사용자 정보 가져오기 실패');
      }

      const userData = await userResponse.json();

      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name || userData.email,
        picture: userData.picture,
        provider: 'google',
      };

      await login(user, id_token || access_token);
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(`Google 로그인 처리 중 오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
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

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">Google 로그인 처리 중...</p>
            </div>
          )}

          {/* Google 로그인 */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading || !GOOGLE_CLIENT_ID}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">
                {loading ? '처리 중...' : 'Google로 계속하기'}
              </span>
            </button>
            {!GOOGLE_CLIENT_ID && (
              <p className="mt-2 text-xs text-red-600">
                VITE_GOOGLE_CLIENT_ID 환경변수가 설정되지 않았습니다.
              </p>
            )}
          </div>

          {/* 구분선 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* 이메일 로그인 (데모) */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
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
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
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
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  disabled={loading}
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
              {loading ? '로그인 중...' : '로그인 (데모)'}
            </button>
          </form>
        </div>

        {/* 환경 변수 안내 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p><strong>필요한 환경변수:</strong></p>
            <p>VITE_GOOGLE_CLIENT_ID: {GOOGLE_CLIENT_ID ? '✓' : '✗'}</p>
            <p>VITE_GOOGLE_CLIENT_SECRET: {import.meta.env.VITE_GOOGLE_CLIENT_SECRET ? '✓' : '✗'}</p>
            <p className="mt-2 text-yellow-600">
              ⚠️ 실제 앱에서는 client_secret을 백엔드에서 처리해야 합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};