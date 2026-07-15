import { NextResponse } from "next/server";
import { counterbalanceConfig } from "@/lib/studyConfig";
import { PID_PATTERN } from "@/lib/submission";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const pid =
    typeof body === "object" &&
    body !== null &&
    "pid" in body &&
    typeof body.pid === "string"
      ? body.pid.trim()
      : "";

  if (!PID_PATTERN.test(pid)) {
    return NextResponse.json(
      {
        error:
          "Participant ID must be 1–64 characters using letters, numbers, hyphens, or underscores.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.rpc("register_participant", {
      participant_pid: pid,
      counterbalance_orders: counterbalanceConfig.orders.map(
        (order) => order.vignetteIds,
      ),
    });

    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "This participant ID has already been used." },
        { status: 409 },
      );
    }
    if (error?.code === "23514") {
      return NextResponse.json(
        { error: "No participant assignment slots remain." },
        { status: 409 },
      );
    }
    if (error) throw error;

    const assignment = Array.isArray(data) ? data[0] : undefined;
    if (
      !assignment ||
      !Array.isArray(assignment.vignette_order) ||
      assignment.vignette_order.length !==
        counterbalanceConfig.vignettesPerParticipant
    ) {
      throw new Error("Counterbalance assignment was not returned.");
    }

    return NextResponse.json(
      {
        pid,
        assignmentSlot: assignment.assignment_slot,
        vignetteOrder: assignment.vignette_order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to create participant", error);
    return NextResponse.json(
      { error: "The study database is unavailable." },
      { status: 503 },
    );
  }
}
