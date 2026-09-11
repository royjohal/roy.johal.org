// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import rehypeExternalLinks from "rehype-external-links";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeFigure from "rehype-figure";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import mermaid from "astro-mermaid";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },

  integrations: [mermaid({
    theme: "neutral",
    autoTheme: true,
  }), react(), sitemap(), mdx()],

  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "append", properties: { ariaHidden: "true", tabIndex: -1, class: "heading-anchor" } }], [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }], rehypeKatex, rehypeFigure],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  site: "https://roy.johal.org",
});