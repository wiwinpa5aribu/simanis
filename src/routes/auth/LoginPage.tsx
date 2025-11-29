/**
 * Login Page - Halaman login SIMANIS
 * Design modern dengan branding sekolah Indonesia
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  LogIn,
  AlertCircle,
  Package,
  Eye,
  EyeOff,
  Shield,
  Building2,
  CheckCircle,
  QrCode,
  FileText,
  ClipboardCheck,
} from 'lucide-react'
import { useState } from 'react'
import { login as loginApi } from '../../libs/api/auth'
import {
  loginSchema,
  type LoginFormInput,
  type LoginFormValues,
} from '../../libs/validation/authSchemas'
import { useAuthStore } from '../../libs/store/authStore'
import { getErrorMessage } from '../../libs/utils/errorHandling'

const features = [
  {
    icon: Package,
    title: 'Manajemen Aset Lengkap',
    description: 'Kelola seluruh aset sekolah dengan mudah dan terstruktur',
  },
  {
    icon: QrCode,
    title: 'QR Code Tracking',
    description: 'Lacak aset dengan scan QR code untuk inventarisasi cepat',
  },
  {
    icon: FileText,
    title: 'Laporan KIB Otomatis',
    description: 'Generate Kartu Inventaris Barang sesuai standar pemerintah',
  },
  {
    icon: ClipboardCheck,
    title: 'Inventarisasi Digital',
    description: 'Opname aset secara digital dengan riwayat lengkap',
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  })

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data, variables) => {
      setAuth(data.user, data.token, variables.rememberMe ?? false)
      navigate('/dashboard')
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error)
    },
  })

  const onSubmit = (data: LoginFormInput) => {
    const formData: LoginFormValues = {
      username: data.username,
      password: data.password,
      rememberMe: data.rememberMe ?? false,
    }
    loginMutation.mutate(formData)
  }

  const handleDemoLogin = () => {
    setAuth(
      { id: '1', username: 'admin', name: 'Administrator', role: 'admin' },
      'demo-token-123',
      true
    )
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      {/* Left Side - Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-20">
        <div className="max-w-lg">
          {/* Logo & Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SIMANIS</h1>
              <p className="text-blue-200">Sistem Manajemen Aset Sekolah</p>
            </div>
          </div>

          {/* School Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-6 h-6 text-blue-200" />
              <span className="text-white font-medium">Instansi Pengguna</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              SMA Negeri 1 Contoh
            </h2>
            <p className="text-blue-200 text-sm">
              Jl. Pendidikan No. 123, Kota Contoh, Indonesia
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{feature.title}</h3>
                  <p className="text-blue-200 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header - Mobile Only */}
            <div className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-3">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">SIMANIS</h1>
              <p className="text-blue-100 text-sm">
                Sistem Manajemen Aset Sekolah
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Masuk ke Akun Anda
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Silakan masukkan kredensial Anda
                </p>
              </div>

              {/* Error Alert */}
              {loginMutation.isError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Gagal Masuk</p>
                    <p className="text-sm mt-1">
                      {getErrorMessage(loginMutation.error) ||
                        'Periksa kembali username dan password Anda.'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Username / NIP
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register('username')}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.username
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Masukkan username atau NIP"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password')}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.password
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="Masukkan password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Ingat Saya</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Lupa Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Masuk
                    </>
                  )}
                </button>
              </form>

              {/* Security Info */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
                <Shield className="w-4 h-4" />
                <span>Koneksi aman dengan enkripsi SSL</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>

              {/* Demo Login */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all text-sm font-medium"
                >
                  🎮 Masuk sebagai Demo User
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-blue-100 text-sm mt-6">
            © 2024 SIMANIS - Sistem Manajemen Aset Sekolah
          </p>
        </div>
      </div>
    </div>
  )
}
