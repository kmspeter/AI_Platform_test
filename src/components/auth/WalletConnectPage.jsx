import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const WalletConnectPage = ({ onComplete, onSkip }) => {
  const { user, updateUser } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    // 팬텀 지갑 설치 여부 확인
    const checkPhantomInstalled = () => {
      const isPhantomInstalled = window.solana && window.solana.isPhantom;
      setPhantomInstalled(isPhantomInstalled);
    };

    checkPhantomInstalled();
    
    // 페이지 포커스 시 다시 확인
    const handleFocus = () => checkPhantomInstalled();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const connectPhantomWallet = async () => {
    if (!phantomInstalled) {
      setError('팬텀 지갑이 설치되지 않았습니다.');
      return;
    }

    setConnecting(true);
    setError('');

    try {
      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      
      setWalletAddress(address);
      
      // 사용자 정보 업데이트
      await updateUser({
        wallet: {
          connected: true,
          address: address,
          network: 'Solana',
          provider: 'Phantom'
        }
      });

      // 연결 완료 후 잠시 대기
      setTimeout(() => {
        onComplete();
      }, 1500);

    } catch (err) {
      console.error('Phantom wallet connection error:', err);
      if (err.code === 4001) {
        setError('사용자가 연결을 거부했습니다.');
      } else {
        setError('지갑 연결에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setConnecting(false);
    }
  };

  const openPhantomDownload = () => {
    window.open('https://phantom.app/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">지갑 연결</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            안녕하세요, {user?.name}님!
          </h2>
          <p className="text-gray-600">
            AI 모델을 구매하고 사용하기 위해 지갑을 연결해주세요
          </p>
        </div>

        {/* 지갑 연결 카드 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {walletAddress && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 font-medium">지갑 연결 완료!</p>
              </div>
              <p className="text-green-700 text-sm font-mono break-all">
                {walletAddress}
              </p>
            </div>
          )}

          {!phantomInstalled ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                팬텀 지갑이 필요합니다
              </h3>
              <p className="text-gray-600 mb-6">
                Solana 네트워크의 모델을 사용하기 위해 팬텀 지갑을 설치해주세요
              </p>
              
              <button
                onClick={openPhantomDownload}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors mb-4"
              >
                팬텀 지갑 설치하기
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center space-x-2 w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>설치 후 새로고침</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                팬텀 지갑 연결
              </h3>
              <p className="text-gray-600 mb-6">
                팬텀 지갑을 연결하여 Solana 기반 AI 모델을 사용하세요
              </p>
              
              <button
                onClick={connectPhantomWallet}
                disabled={connecting || walletAddress}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {connecting ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>연결 중...</span>
                  </>
                ) : walletAddress ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>연결됨</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5" />
                    <span>팬텀 지갑 연결</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 지갑 연결의 이점 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">지갑 연결의 이점</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">AI 모델 라이선스 구매 및 관리</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">블록체인 기반 투명한 거래</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">탈중앙화된 AI 생태계 참여</p>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="mt-8 flex space-x-3">
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              나중에 연결
            </button>
            {walletAddress && (
              <button
                onClick={onComplete}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>계속하기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">보안 안내</p>
              <p>
                지갑 연결 시 개인키는 절대 공유되지 않으며, 
                모든 거래는 사용자의 승인 하에 이루어집니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};