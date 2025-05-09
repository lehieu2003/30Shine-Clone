import apiClient from '@/lib/api'

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  phone: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
}

const authService = {
  async registerUser(data: RegisterPayload): Promise<User> {
    const response = await apiClient.post<User>('/api/auth/register', data)
    return response.data
  },

  async loginUser(
    data: LoginPayload,
  ): Promise<{ accessToken: string; user: User }> {
    const response = await apiClient.post<{ accessToken: string; user: User }>(
      '/api/auth/login',
      data,
    )
    return response.data
  },

  async getCurrentUser(): Promise<any> {
    const response = await apiClient.get<any>('/api/auth/current')
    return response.data
  },

  async isPhoneRegistered(phone: string): Promise<boolean> {
    const response = await apiClient.get<{ isRegistered: boolean }>(
      `/api/auth/is-phone-registered`,
      { params: { phone } },
    )
    return response.data.isRegistered
  },

  async isEmailRegistered(email: string): Promise<boolean> {
    const response = await apiClient.get<{ isRegistered: boolean }>(
      `/api/auth/is-email-registered`,
      { params: { email } },
    )
    return response.data.isRegistered
  },
}

export default authService
