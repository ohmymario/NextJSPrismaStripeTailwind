import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"

interface contextProps {
  params: {
    downloadVerificationId: string
  }
}

export async function GET(req: NextRequest, { params }: contextProps) {

  // id from URL
  const downloadVerificationId = params.downloadVerificationId

  // Find file from db
  const data = await db.downloadVerifications.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  })

  // error if no data redir to expired page
  if (!data) return NextResponse.redirect(new URL("/products/download/expired", req.url))


  // Read file and send it as response
  const { size } = await fs.stat(data.product.filePath)
  const file = await fs.readFile(data.product.filePath)
  const extension = data.product.filePath.split(".").pop()

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  })
} 