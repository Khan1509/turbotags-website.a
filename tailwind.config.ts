import type { Config } from "tailwindcss";

const config = {
	// Enable dark mode based on the 'class' attribute on the HTML element
	darkMode: ["class"],
	// Configure files to scan for Tailwind classes to purge unused CSS
	content: [
		"./public/**/*.html", // This line is changed: It now correctly scans all HTML files inside the 'public' directory and its subdirectories.
		// If you have separate JS files that dynamically add Tailwind classes, list them here:
		// "./src/**/*.js",
		// "./src/**/*.ts",
		// "./src/**/*.jsx",
		// "./src/**/*.tsx",
		// Add any other paths where you use Tailwind classes
	],
	// Add a prefix to all Tailwind classes if needed (e.g., 'tw-')
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			// Custom colors based on your existing CSS
			colors: {
				// Your primary brand colors
				"tt-dark-violet": "hsl(241 80% 12%)", // #151440
				"tt-medium-violet": "hsl(238 31% 62%)", // #7A7EBF
				"tt-light-violet": "hsl(246 17% 75%)", // #9E99BF
				// Your background color
				"tt-light-yellow": "hsl(54 62% 83%)", // #F2EEB6

				// Default Tailwind colors (you can uncomment and define these if you use them with CSS variables)
				// border: 'hsl(var(--border))',
				// input: 'hsl(var(--input))',
				// ring: 'hsl(var(--ring))',
				// background: 'hsl(var(--background))',
				// foreground: 'hsl(var(--foreground))',
				// primary: {
				//   DEFAULT: 'hsl(var(--primary))',
				//   foreground: 'hsl(var(--primary-foreground))',
				// },
				// secondary: {
				//   DEFAULT: 'hsl(var(--secondary))',
				//   foreground: 'hsl(var(--secondary-foreground))',
				// },
				// destructive: {
				//   DEFAULT: 'hsl(var(--destructive))',
				//   foreground: 'hsl(var(--destructive-foreground))',
				// },
				// muted: {
				//   DEFAULT: 'hsl(var(--muted))',
				//   foreground: 'hsl(var(--muted-foreground))',
				// },
				// accent: {
				//   DEFAULT: 'hsl(var(--accent))',
				//   foreground: 'hsl(var(--accent-foreground))',
				// },
				// popover: {
				//   DEFAULT: 'hsl(var(--popover))',
				//   foreground: 'hsl(var(--popover-foreground))',
				// },
				// card: {
				//   DEFAULT: 'hsl(var(--card))',
				//   foreground: 'hsl(var(--card-foreground))',
				// },
			},
			// Custom borderRadius values
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			// Custom keyframes for animations based on your existing CSS
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"glow": { // This 'glow' keyframe was in your provided config, keeping it
					"0%": { boxShadow: "0 0 20px hsl(262 90% 65% / 0.3)" },
					"100%": { boxShadow: "0 0 30px hsl(262 90% 65% / 0.6)" },
				},
				"fade-in": { // This 'fade-in' keyframe was in your provided config, keeping it
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-up": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				// Animations from your existing CSS
				"turbotags-text-glow": "text-glow 1.5s infinite alternate",
				"turbotags-button-glow": "button-glow 1.5s infinite alternate",
				"animate-fade-in": "fade-in-custom 0.5s ease-out forwards",
				"thunder-icon-pulse": "pulse-custom 1s infinite alternate",
				// Existing animations from your tailwind.config.ts
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				// Custom animations defined in your input.css (if you want to use them as Tailwind utilities)
				"text-glow": "text-glow 1.5s infinite alternate",
				"button-glow": "button-glow 1.5s infinite alternate",
				"fade-in-custom": "fade-in 0.5s ease-out forwards",
				"pulse-custom": "pulse 1s infinite alternate",
				"rocket-float": "rocket-float 0.8s infinite alternate",
			},
		},
	},
	plugins: [
		// require("tailwindcss-animate") // Uncomment if you use this plugin
	],
} satisfies Config;

export default config;
