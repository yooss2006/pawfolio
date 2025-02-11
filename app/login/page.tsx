'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import CryptoJS from 'crypto-js';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);

    const hashedPassword = CryptoJS.SHA256(password).toString();

    localStorage.setItem(
      'user',
      JSON.stringify({
        email,
        password: hashedPassword,
        loggedIn: true
      })
    );

    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="flex h-[100dvh] items-center justify-center p-4">
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-theme-primary">Pawfolio</CardTitle>
          <CardDescription className="text-lg font-medium text-gray-400">
            당신만의 특별한 전시회를 시작해보세요
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-primary">이메일</label>
              <Input
                type="email"
                placeholder="hello@pawfolio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-primary-light rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              />
              {emailError && (
                <p className="mt-1 text-xs font-medium text-theme-accent">{emailError}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-primary">비밀번호</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary-light rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              />
              {passwordError && (
                <p className="mt-1 text-xs font-medium text-theme-accent">{passwordError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full rounded-lg bg-gradient-to-r from-theme-secondary to-theme-primary py-3 font-bold text-white shadow-md transition-all duration-200 hover:opacity-90"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
