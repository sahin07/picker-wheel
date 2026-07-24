import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 96,
            border: "10px solid rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#eab308",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 28,
              background: "#16a34a",
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
