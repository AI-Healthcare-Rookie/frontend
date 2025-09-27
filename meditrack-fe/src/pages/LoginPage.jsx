import { useEffect } from "react";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => { if (user) nav("/", { replace:true }); }, [user, nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg p-8">
        <div className="mb-8 flex items-center gap-2">
          <img src="/logo.svg" alt="MediTrack" className="h-6" />
          <span className="text-xl font-semibold">MediTrack</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">로그인</h1>
        <p className="text-gray-500 mb-6">Google Email로 로그인해주세요</p>
        <GoogleLoginButton />
        <p className="text-xs mt-8 text-gray-400">© 연암공대 X 마산대 헬스케어 해커톤</p>
      </div>
      {/* 우측 일러스트는 CSS 배경 or img로 */}
    </div>
  );
}
