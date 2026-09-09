import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import site_config from "@/site-config.json";

const poppinsRegular = fs.readFileSync("src/assets/fonts/Poppins-400.woff");
const poppinsMedium = fs.readFileSync("src/assets/fonts/Poppins-500.woff");
const loraSemibold = fs.readFileSync("src/assets/fonts/Lora-600.woff");

const wordmark = site_config.domain.replace(/^https?:\/\//, "");

export interface OGOptions {
  title: string;
  description: string;
  category?: string;
  date?: string;
}

export async function generateOGImage({
  title,
  description,
  category,
  date,
}: OGOptions) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          background: "#18181b",
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
          fontFamily: "Poppins",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: 12 },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#a1a1aa",
                    },
                  },
                },
                {
                  type: "span",
                  props: {
                    style: { fontSize: 20, color: "#a1a1aa", fontWeight: 400 },
                    children: wordmark,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: { style: { flex: 1 } },
          },
          {
            type: "h1",
            props: {
              style: {
                fontFamily: "Lora",
                fontSize: title.length > 40 ? 40 : 56,
                fontWeight: 600,
                color: "#fafafa",
                lineHeight: 1.15,
                margin: 0,
              },
              children: title,
            },
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: 28,
                color: "#a1a1aa",
                marginTop: 16,
                lineHeight: 1.4,
              },
              children: description,
            },
          },
          (category || date)
            ? {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginTop: 32,
                  },
                  children: [
                    ...(category
                      ? [
                          {
                            type: "span",
                            props: {
                              style: {
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#a1a1aa",
                                border: "1px solid #3f3f46",
                                borderRadius: 4,
                                padding: "4px 12px",
                              },
                              children: category,
                            },
                          },
                        ]
                      : []),
                    ...(date
                      ? [
                          {
                            type: "span",
                            props: {
                              style: { fontSize: 14, color: "#71717a" },
                              children: date,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              }
            : null,
        ].filter(Boolean),
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Poppins",
          data: poppinsRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Poppins",
          data: poppinsMedium,
          weight: 500,
          style: "normal",
        },
        {
          name: "Lora",
          data: loraSemibold,
          weight: 600,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}
