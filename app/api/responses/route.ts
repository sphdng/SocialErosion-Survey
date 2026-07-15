import { NextResponse } from "next/server";
import {
  buildResponseRow,
  PID_PATTERN,
  SubmissionValidationError,
} from "@/lib/submission";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const submittedPid =
    typeof requestBody === "object" &&
    requestBody !== null &&
    "pid" in requestBody &&
    typeof requestBody.pid === "string"
      ? requestBody.pid.trim()
      : "";
  if (!PID_PATTERN.test(submittedPid)) {
    return NextResponse.json(
      { error: "Invalid participant ID." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: participant, error: participantLookupError } = await supabase
    .from("participants")
    .select("vignette_order")
    .eq("pid", submittedPid)
    .maybeSingle();
  if (participantLookupError) {
    console.error("Unable to load participant assignment", participantLookupError);
    return NextResponse.json(
      { error: "The response could not be saved. Please try again." },
      { status: 503 },
    );
  }
  if (
    !participant ||
    !Array.isArray(participant.vignette_order) ||
    participant.vignette_order.length !== 6
  ) {
    return NextResponse.json(
      { error: "Participant assignment was not found." },
      { status: 400 },
    );
  }

  let row: ReturnType<typeof buildResponseRow>;
  try {
    row = buildResponseRow(requestBody, participant.vignette_order);
  } catch (error) {
    if (error instanceof SubmissionValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  try {
    const { error } = await supabase
      .from("vignette_responses")
      .upsert(row, { onConflict: "pid,vignette_number" });

    if (error) throw error;

    const { count, error: countError } = await supabase
      .from("vignette_responses")
      .select("*", { count: "exact", head: true })
      .eq("pid", row.pid);
    if (countError) throw countError;

    const completed = count === participant.vignette_order.length;
    if (completed) {
      const { error: participantError } = await supabase
        .from("participants")
        .update({ completed_at: new Date().toISOString() })
        .eq("pid", row.pid);
      if (participantError) throw participantError;
    }

    return NextResponse.json(
      { saved: true, completed },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unable to save vignette response", error);
    return NextResponse.json(
      { error: "The response could not be saved. Please try again." },
      { status: 503 },
    );
  }
}
