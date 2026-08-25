import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RealLyfe Lawyer — Birth Injury, Malpractice & Accident Attorney";

export default async function OpengraphImage() {
  const markBase64 = fs.readFileSync(path.join(process.cwd(), "public/brand/taylor-mark.png")).toString("base64");
  const markSrc = `data:image/png;base64,${markBase64}`;

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
          background: "linear-gradient(180deg, #3A1640 0%, #0A0A0A 65%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            display: "flex",
            background: "linear-gradient(90deg, #F3DA8C 0%, #B8942E 100%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={210} height={249} style={{ marginBottom: 28 }} />
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#FFFFFF" }}>
          <span>RealLyfe</span>
          <span style={{ color: "#D4AF37", marginLeft: 18 }}>Lawyer</span>
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 30, color: "#CCCCCC" }}>
          Birth Injury · Malpractice · Mass Torts · Accidents
        </div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 24, color: "#888888" }}>
          Licensed in Texas, Oklahoma, New Mexico &amp; Arizona
        </div>
      </div>
    ),
    { ...size }
  );
}
