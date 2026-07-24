import { ImageResponse } from "next/og"

export const alt = "Random Name Wheel Picker"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** PNG Open Graph image for the home route (social crawlers prefer raster). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #065f46 0%, #10b981 55%, #34d399 100%)",
          color: "#fff",
          fontFamily: "Segoe UI, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 6,
            opacity: 0.9,
            marginBottom: 24,
          }}
        >
          PICKER WHEEL
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Random Name Wheel Picker
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            opacity: 0.92,
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          Spin the wheel online free
        </div>
      </div>
    ),
    size,
  )
}
