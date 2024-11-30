// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import remarkMath from "remark-math"

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath],
	},
	integrations: [
		starlight({
			title: "IgnitionAI",
			favicon: "./favicon.png",
			customCss: [
				// Relative path to your custom CSS file
				"./src/styles/custom.css",
			],
			logo: {
				replacesTitle: true,
				src: "./src/assets/ignition_flame.gif",
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
					autogenerate: { directory: "tutoriel", collapsed: true },
				},
				{
					label: "Documentation",
					autogenerate: { directory: "documentation", collapsed: true },
				},
			],
		}),
	],
});
