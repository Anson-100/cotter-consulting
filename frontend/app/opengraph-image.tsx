import { ImageResponse } from "next/og"
import { createClient } from "@/lib/supabase/server"

export const runtime = "edge"
export const alt = "Estimate — PirateShip"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: bid } = await supabase
    .from("bids")
    .select("*")
    .eq("id", id)
    .single()

  const blocks =
    (bid?.blocks as Array<{
      type: string
      jobName?: string
      recipientName?: string
    }>) ?? []

  const greeting = blocks.find((b) => b.type === "GreetingBox")
  const jobName = greeting?.jobName || "Estimate"
  const recipientName = greeting?.recipientName || ""

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f4f5",
        fontFamily: "system-ui, sans-serif",
        padding: "60px",
      }}
    >
      {/* Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "50px 80px",
          border: "2px solid #e4e4e7",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {/* Logo row */}

        {/* Job name */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 900,
            color: "#18181b",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {jobName}
        </div>

        {/* Recipient */}
        {recipientName && (
          <div
            style={{
              fontSize: "24px",
              color: "#71717a",
              marginTop: "12px",
            }}
          >
            Prepared for {recipientName}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            fontSize: "20px",
            color: "#0284c7",
            fontWeight: 600,
            marginTop: "28px",
          }}
        >
          Click or tap to view estimate
        </div>
      </div>

      {/* Bottom branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "32px",
          fontSize: "18px",
          color: "#71717a",
        }}
      >
        thepirateship.co
      </div>
    </div>,
    { ...size },
  )
}
