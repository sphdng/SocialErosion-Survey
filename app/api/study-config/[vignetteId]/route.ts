import { NextResponse } from "next/server";
import {
  assertValidStudyConfig,
  getPublicVignetteConfig,
} from "@/lib/studyConfig";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://nyu.qualtrics.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=60, s-maxage=300",
};

interface RouteContext {
  params: Promise<{ vignetteId: string }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    assertValidStudyConfig();
  } catch {
    return NextResponse.json(
      { error: "Study configuration is unavailable." },
      { status: 500, headers: corsHeaders },
    );
  }

  const { vignetteId } = await params;
  const config = getPublicVignetteConfig(vignetteId);

  if (!config) {
    return NextResponse.json(
      { error: "Vignette not found." },
      { status: 404, headers: corsHeaders },
    );
  }

  return NextResponse.json(config, { headers: corsHeaders });
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
