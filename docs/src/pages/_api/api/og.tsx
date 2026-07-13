import { Handler } from "vocs/server"

export default function handler(request: Request) {
  return Handler.og(({ title, description, logo }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        padding: 80,
        background:
          "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.13), transparent 34rem), radial-gradient(circle at 18% 18%, rgba(80, 180, 255, 0.2), transparent 30rem), radial-gradient(circle at 82% 12%, rgba(120, 90, 255, 0.2), transparent 34rem), linear-gradient(180deg, #08111f 0%, #070b14 46%, #05070c 100%)",
        color: "rgba(255, 255, 255, 0.94)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 40,
          border: "1px solid rgba(86, 215, 255, 0.18)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018))",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.26)",
        }}
      />
      {logo && <img alt="" src={logo} style={{ height: 48, position: "absolute", right: 40, bottom: 40 }} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: title.length < 15 ? 80 : 64, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        {description && (
          <div style={{ fontSize: 28, color: "rgba(255, 255, 255, 0.62)", maxWidth: 800 }}>{description}</div>
        )}
      </div>
    </div>
  )).fetch(request)
}
