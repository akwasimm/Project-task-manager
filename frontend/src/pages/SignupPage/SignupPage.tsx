// src/pages/SignupPage/SignupPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, Eye, EyeOff } from 'lucide-react'
import { authApi } from '../../api/auth.api'
import './SignupPage.css'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['admin', 'member']),
})

type FormData = z.infer<typeof schema>

const SignupPage = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [apiError,     setApiError]     = useState('')
  const [isLoading,    setIsLoading]    = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'member' },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setApiError('')
    try {
      await authApi.signup(data)
      navigate('/login')
    } catch (err: any) {
      setApiError(
        err?.response?.data?.detail || 'Signup failed. Please try again.'
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
          <h1 className='auth-card__title'>Create account</h1>
          <p className='auth-card__subtitle'>Start managing your projects</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
          {apiError && (
            <div className='auth-form__error'>{apiError}</div>
          )}

          {/* Name */}
          <div className='form-group'>
            <label className='form-label'>Full Name</label>
            <input
              type='text'
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder='John Doe'
              {...register('name')}
            />
            {errors.name && (
              <span className='form-error'>{errors.name.message}</span>
            )}
          </div>

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

          {/* Role */}
          <div className='form-group'>
            <label className='form-label'>Role</label>
            <select className='form-select' {...register('role')}>
              <option value='member'>Member</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <button
            type='submit'
            className='btn btn-primary btn-lg w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className='auth-card__footer'>
          Already have an account?{' '}
          <Link to='/login' className='auth-card__link'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage