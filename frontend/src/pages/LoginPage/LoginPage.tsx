// src/pages/LoginPage/LoginPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, Eye, EyeOff } from 'lucide-react'
import { authApi } from '../../api/auth.api'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

const LoginPage = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [apiError,     setApiError]     = useState('')
  const [isLoading,    setIsLoading]    = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setApiError('')
    try {
      const tokenRes = await authApi.login(data)
      localStorage.setItem('token', tokenRes.access_token)
      const user = await authApi.getMe()
      login(tokenRes.access_token, user)
      navigate('/')
    } catch (err: any) {
      setApiError(
        err?.response?.data?.detail || 'Login failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        {/* Header */}
        <div className='auth-card__header'>
          <div className='auth-card__logo'>
            <Briefcase size={28} color='var(--primary)' />
          </div>
          <h1 className='auth-card__title'>Welcome back</h1>
          <p className='auth-card__subtitle'>Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
          {/* API Error */}
          {apiError && (
            <div className='auth-form__error'>{apiError}</div>
          )}

          {/* Email */}
          <div className='form-group'>
            <label className='form-label'>Email</label>
            <input
              type='email'
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder='you@example.com'
              {...register('email')}
            />
            {errors.email && (
              <span className='form-error'>{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className='form-group'>
            <label className='form-label'>Password</label>
            <div className='auth-form__password'>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder='••••••••'
                {...register('password')}
              />
              <button
                type='button'
                className='auth-form__eye'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className='form-error'>{errors.password.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type='submit'
            className='btn btn-primary btn-lg w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className='auth-card__footer'>
          Don't have an account?{' '}
          <Link to='/signup' className='auth-card__link'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage