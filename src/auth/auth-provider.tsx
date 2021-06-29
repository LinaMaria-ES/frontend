import { AuthorizationPayload } from '@serlo/authorization'
import { gql } from 'graphql-request'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Token } from 'simple-oauth2'

import {
  createAuthAwareGraphqlFetch,
  createGraphqlFetch,
} from '@/api/graphql-fetch'

export interface AuthContextValue {
  loggedIn: boolean
  authenticationPayload: RefObject<AuthenticationPayload>
  authorizationPayload: AuthorizationPayload | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const contextValue = useContext(AuthContext)

  if (contextValue === null) {
    throw new Error('Attempt to use auth data outside of provider!')
  }

  return contextValue
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticationPayload, loggedIn] = useAuthentication()
  const authorizationPayload = useAuthorizationPayload(authenticationPayload)

  return (
    <AuthContext.Provider
      value={{
        authenticationPayload,
        authorizationPayload,
        loggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export type AuthenticationPayload = {
  username: string
  id: number
  token: string
  refreshToken(usedToken: string): Promise<void>
  clearToken(): void
} | null

function useAuthentication(): [RefObject<AuthenticationPayload>, boolean] {
  const initialValue = parseAuthCookie()
  const authenticationPayload = useRef<AuthenticationPayload>(initialValue)
  const pendingRefreshTokenPromise = useRef<Promise<void> | null>(null)

  const [loggedIn, setLoggedIn] = useState(() => {
    return initialValue !== null
  })

  function parseAuthCookie(): AuthenticationPayload {
    try {
      const cookies = typeof window === 'undefined' ? {} : Cookies.get()

      const { access_token, id_token } = JSON.parse(
        cookies['auth-token']
      ) as Token
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const decoded = jwt_decode(id_token) as { username: string; id: number }

      return {
        username: decoded.username,
        id: decoded.id,
        token: access_token as string,
        refreshToken,
        clearToken,
      }
    } catch {
      return null
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async function refreshToken(usedToken: string) {
    async function startRefreshTokenPromise(): Promise<void> {
      if (typeof window === 'undefined') return

      await fetch('/api/auth/refresh-token', {
        method: 'POST',
      })

      authenticationPayload.current = parseAuthCookie()
      pendingRefreshTokenPromise.current = null
    }

    const currentCookieValue = parseAuthCookie()
    if (currentCookieValue === null || currentCookieValue.token !== usedToken) {
      // Cooke has a newer token than the one we used for the request. So use that instead.
      authenticationPayload.current = currentCookieValue
      return
    }

    if (!pendingRefreshTokenPromise.current) {
      // Only initiate the token refresh request if it has not been started already.
      pendingRefreshTokenPromise.current = startRefreshTokenPromise()
    }

    return pendingRefreshTokenPromise.current
  }

  function clearToken() {
    if (!loggedIn) return
    Cookies.remove('auth-token')
    setLoggedIn(false)
  }

  return [authenticationPayload, loggedIn]
}

function useAuthorizationPayload(
  authenticationPayload: RefObject<AuthenticationPayload>
) {
  async function fetchAuthorizationPayload(
    authenticationPayload: RefObject<AuthenticationPayload>
  ): Promise<AuthorizationPayload> {
    const fetch =
      authenticationPayload.current === null
        ? createGraphqlFetch()
        : createAuthAwareGraphqlFetch(authenticationPayload)

    const data = (await fetch(
      JSON.stringify({
        query: gql`
          query {
            authorization
          }
        `,
      })
    )) as { authorization: AuthorizationPayload }
    return data.authorization
  }

  const [authorizationPayload, setAuthorizationPayload] =
    useState<AuthorizationPayload | null>(null)

  useEffect(() => {
    void fetchAuthorizationPayload(authenticationPayload).then(
      (authorizationPayload) => {
        setAuthorizationPayload(authorizationPayload)
      }
    )
  }, [authenticationPayload, authenticationPayload.current?.id])

  return authorizationPayload
}
