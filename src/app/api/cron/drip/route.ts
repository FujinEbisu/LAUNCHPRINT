import { NextRequest, NextResponse } from 'next/server'
import { runDueDrip } from '@/lib/mailer'

function auth(req: NextRequest) { return req.headers.get('x-admin-key') === process.env.ADMIN_INTERNAL_KEY }

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = await runDueDrip()
  return NextResponse.json(result)
}
