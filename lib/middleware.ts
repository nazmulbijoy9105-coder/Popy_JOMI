import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromHeader, verifyToken } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: { userId: string; email: string; role: string; plan: string }
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const authReq = req as AuthenticatedRequest
    authReq.user = payload
    return handler(authReq)
  }
}

export function withRole(roles: string[]) {
  return function (
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return handler(req)
    })
  }
}

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}
