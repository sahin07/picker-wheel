import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "Custom Shared Wheel | Picker Wheel" },
  description:
    "Open a shared custom spin wheel link. Wheels are stored on this device or packed into the share URL.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function CustomWheelSlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
