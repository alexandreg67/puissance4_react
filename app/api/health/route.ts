/**
 * Health check endpoint for monitoring and load balancers
 * Returns application status and basic metrics
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      limit: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    features: {
      neonUI: true,
      responsiveDesign: true,
      aiOpponent: true,
      performanceOptimized: true,
    },
  };

  return NextResponse.json(healthCheck, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}