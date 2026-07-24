import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eab308",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 14,
            background: "#16a34a",
          }}
        />
      </div>
    ),
    size,
  )
}
