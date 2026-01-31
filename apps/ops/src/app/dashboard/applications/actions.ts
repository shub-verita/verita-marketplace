"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@verita/database";
import { auth } from "@/lib/auth";

type ApplicationStatus = "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.application.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard/applications");
  revalidatePath(`/dashboard/applications/${id}`);
}

export async function addApplicationNote(
  applicationId: string,
  noteText: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!noteText.trim()) {
    throw new Error("Note text is required");
  }

  await prisma.applicationNote.create({
    data: {
      applicationId,
      authorId: session.user.id,
      noteText: noteText.trim(),
    },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
}
