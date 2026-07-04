import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { markGuestInvitationSent } from "@/lib/supabase-rest";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { guestId } = (await request.json()) as { guestId?: string };

  if (!guestId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const guest = await markGuestInvitationSent(guestId);
    return NextResponse.json({ ok: true, guest });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
