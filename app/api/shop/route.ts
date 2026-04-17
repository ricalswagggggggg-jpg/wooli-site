import { NextResponse } from "next/server";
import shopData from "@/data/wooli-shop-local.json";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(shopData);
}
