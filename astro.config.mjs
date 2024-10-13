// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // Katex plugin options
        },
      ],
    ],
  },
  integrations: [
    starlight({
      title: "IgnitionAI",
      favicon: "./src/assets/IgnitionAI.png",
      logo: {
        replacesTitle: true,
        src: "./src/assets/IgnitionAI.png",
        alt: "IgnitionAI",
      },
      social: {
        github: "https://github.com/salim4n",
        twitter: "https://x.com/salim4n_dev",
        linkedin: "https://www.linkedin.com/in/salim4n/",
        youtube: "https://www.youtube.com/@salimnegan7289",
      },
      sidebar: [
        {
          label: "Tutoriel",
          autogenerate: { directory: "tutoriel" },
        },
        {
          label: "Documentation",
          autogenerate: { directory: "documentation" },
        },
      ],
    }),
  ],
})
