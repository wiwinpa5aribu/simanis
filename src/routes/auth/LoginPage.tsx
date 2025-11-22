import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import { login as loginApi } from '../../libs/api/auth'
import {
  loginSchema,
  type LoginFormValues,
} from '../../libs/validation/authSchemas'
import { useAuthStore } from '../../libs/store/authStore'
import { getErrorMessage } from '../../libs/utils/errorHandling'

// Komponen Halaman Login
// Menangani input user, validasi, dan pemanggilan API login
export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.login)

  // Setup React Hook Form dengan Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  // Setup Mutation untuk Login API
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Simpan user & token ke store global
      setAuth(data.user, data.token)
      // Redirect ke halaman aset
      navigate('/assets')
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error)
      // Error handling akan ditampilkan di UI
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  // Simulasi Login untuk Demo (Jika Backend belum siap)
  // Hapus bagian ini jika backend sudah terintegrasi penuh
  const handleDemoLogin = () => {
    setAuth(
      { id: '1', username: 'demo', name: 'Demo User', role: 'admin' },
      'demo-token-123'
    )
    navigate('/assets')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">SIMANIS</h1>
          <p className="text-blue-100">Sistem Manajemen Aset</p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Masuk ke Akun Anda
          </h2>

          {/* Error Alert */}
          {loginMutation.isError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Gagal Masuk</p>
                <p className="text-sm">
                  {/* Tampilkan pesan error dari backend jika ada, atau pesan umum */}
                  {getErrorMessage(loginMutation.error) ||
                    'Periksa kembali username dan password Anda.'}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username / Email
              </label>
              <input
                id="username"
                type="text"
                {...register('username')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

          {/* Demo Button (Optional) */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-sm text-gray-500 hover:text-blue-600 underline"
            >
              Masuk sebagai Demo User (Tanpa Backend)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
