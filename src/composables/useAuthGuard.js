/**
 * Auth Guard Composable
 * Checks authentication on page show and redirects to login if not authenticated.
 * Apply in any page that requires login by calling useAuthGuard() in <script setup>.
 */

import { onShow } from '@dcloudio/uni-app'
import { useAuth } from './useAuth'

export function useAuthGuard() {
  const { checkAuth } = useAuth()

  onShow(() => {
    const isAuthenticated = checkAuth()
    if (!isAuthenticated) {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  })
}
