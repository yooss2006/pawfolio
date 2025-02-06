'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import CryptoJS from 'crypto-js'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateInputs = () => {
    let valid = true
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요')
      valid = false
    } else {
      setEmailError('')
    }

    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요')
      valid = false
    } else {
      setPasswordError('')
    }

    return valid
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateInputs()) return
    
    setIsLoading(true)

    const hashedPassword = CryptoJS.SHA256(password).toString()

    localStorage.setItem('user', JSON.stringify({
      email,
      password: hashedPassword,
      loggedIn: true
    }))

    setTimeout(() => {
      setIsLoading(false)
      router.push('/')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-theme-primary">Pawfolio</CardTitle>
          <CardDescription className="text-gray-400 text-lg font-medium">
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
                className="border border-primary-light rounded-lg focus:ring-2 focus:ring-primary px-3 py-2"
              />
              {emailError && <p className="text-theme-accent text-xs mt-1 font-medium">{emailError}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-primary">비밀번호</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-primary-light rounded-lg focus:ring-2 focus:ring-primary px-3 py-2"
              />
              {passwordError && <p className="text-theme-accent text-xs mt-1 font-medium">{passwordError}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-theme-secondary to-theme-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
