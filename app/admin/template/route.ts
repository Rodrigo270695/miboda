import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { createGuestTemplateXlsx } from "@/lib/xlsx";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const workbook = createGuestTemplateXlsx();

  return new Response(workbook, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="plantilla-invitados.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
