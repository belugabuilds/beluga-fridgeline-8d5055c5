import "./globals.css";
export const metadata = { title: "FridgeLine", description: "Track what's in your fridge by expiry date and instantly get recipe suggestions before food goes to waste." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
