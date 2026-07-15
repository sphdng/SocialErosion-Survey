"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudyError } from "@/components/StudyError";
import { StudyLoading } from "@/components/StudyLoading";
import { assignRandomVignette } from "@/lib/vignetteAssignment";

interface StudyPageClientProps {
  vignetteIds: string[];
}

export function StudyPageClient({
  vignetteIds,
}: StudyPageClientProps) {
  const router = useRouter();

  useEffect(() => {
    try {
      const assigned = assignRandomVignette(
        vignetteIds,
        window.sessionStorage,
      );
      router.replace(`/study?vignette=${encodeURIComponent(assigned)}`);
    } catch {
      // The participant-safe error below remains visible.
    }
  }, [router, vignetteIds]);

  if (vignetteIds.length === 0) {
    return <StudyError />;
  }

  return <StudyLoading />;
}
