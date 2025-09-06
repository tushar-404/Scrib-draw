import Island from "./components/Canvas/Island";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 9999, // above everything
            pointerEvents: "auto", // clickable
          }}
        >
          <Island />
        </div>

        {children}
      </body>
    </html>
  );
}
