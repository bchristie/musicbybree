import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export async function GET() {
  // Use Vercel's git commit SHA for production, timestamp for local dev
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA || `local-${Date.now()}`;
  const version = buildId.startsWith('local-') ? buildId : `v-${buildId}`;

  // Read the service worker template
  const templatePath = join(process.cwd(), 'app', 'sw.js', 'sw.template.js');
  const template = readFileSync(templatePath, 'utf8');

  // Replace placeholders
  const serviceWorkerContent = template.replace(/__VERSION__/g, version);

  return new NextResponse(serviceWorkerContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

