import { Handler } from "vocs/server"

export default function handler(request: Request) {
  return Handler.og(({ title, description, logo }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 80,
        backgroundColor: "#161616",
        color: "#ffffff",
      }}
    >
      {logo && <img alt="" src={logo} style={{ height: 48, position: "absolute", right: 40, bottom: 40 }} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: title.length < 15 ? 80 : 64, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        {description && (
          <div style={{ fontSize: 28, color: "rgba(255, 255, 255, 0.6)", maxWidth: 800 }}>{description}</div>
        )}
      </div>
    </div>
  )).fetch(request)
}
