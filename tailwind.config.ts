import type { Config } from "tailwindcss";

const config = {
	// Enable dark mode based on the 'class' attribute on the HTML element
	darkMode: ["class"],
	// Configure files to scan for Tailwind classes to purge unused CSS
	content: [
		"./index.html", // Your main HTML file
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
				"tt-dark-violet": "#151440",
				"tt-medium-violet": "#7A7EBF",
				"tt-light-violet": "#9E99BF",
				// Your background color
				"tt-light-yellow": "#F2EEB6",

				// Default Tailwind colors (you can uncomment and define these if you use them with CSS variables)
				// border: 'hsl(var(--border))',
				// input: 'hsl(var(--input))',
				// ring: 'hsl(var(--ring))',
				// background: 'hsl(var(--background))',
				// foreground: 'hsl(var(--foreground))',
				// primary: {
				// 	DEFAULT: 'hsl(var(--primary))',
				// 	foreground: 'hsl(var(--primary-foreground))'
				// },
				// secondary: {
				// 	DEFAULT: 'hsl(var(--secondary))',
				// 	foreground: 'hsl(var(--secondary-foreground))'
				// },
				// destructive: {
				// 	DEFAULT: 'hsl(var(--destructive))',
				// 	foreground: 'hsl(var(--destructive-foreground))'
				// },
				// muted: {
				// 	DEFAULT: 'hsl(var(--muted))',
				// 	foreground: 'hsl(var(--muted-foreground))'
				// },
				// accent: {
				// 	DEFAULT: 'hsl(var(--accent))',
				// 	foreground: 'hsl(var(--accent-foreground))'
				// },
				// popover: {
				// 	DEFAULT: 'hsl(var(--popover))',
				// 	foreground: 'hsl(var(--popover-foreground))'
				// },
				// card: {
				// 	DEFAULT: 'hsl(var(--card))',
				// 	foreground: 'hsl(var(--card-foreground))'
				// },
				// sidebar: {
				// 	DEFAULT: 'hsl(var(--sidebar-background))',
				// 	foreground: 'hsl(var(--sidebar-foreground))',
				// 	primary: 'hsl(var(--sidebar-primary))',
				// 	'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				// 	accent: 'hsl(var(--sidebar-accent))',
				// 	'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				// 	border: 'hsl(var(--sidebar-border))',
				// 	ring: 'hsl(var(--sidebar-ring))'
				// }
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				// Keyframes from your existing CSS
				"text-glow": {
					"from": { textShadow: "0 0 5px rgba(21, 20, 64, 0.5)" },
					"to": { textShadow: "0 0 20px rgba(21, 20, 64, 0.9), 0 0 30px rgba(122, 125, 191, 0.7)" },
				},
				"button-glow": {
					"from": { boxShadow: "0 0 5px rgba(21, 20, 64, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
					"to": { boxShadow: "0 0 20px rgba(21, 20, 64, 0.9), 0 0 30px rgba(122, 125, 191, 0.7), 0 20px 25px -5px rgba(0, 0, 0, 0.1)" },
				},
				"fade-in-custom": { // Renamed to avoid conflict with user's 'fade-in'
					"from": { opacity: "0", transform: "translateY(10px)" },
					"to": { opacity: "1", transform: "translateY(0)" },
				},
				"pulse-custom": { // Renamed to avoid conflict with user's 'glow'
					"0%": { transform: "scale(1)", opacity: "1" },
					"100%": { transform: "scale(1.1)", opacity: "0.8" },
				},
				"rocket-float": {
					"0%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-5px)" },
					"100%": { transform: "translateY(0px)" },
				},
				// Keyframes from your provided tailwind.config
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
				"rocket-float-anim": "rocket-float 0.8s infinite alternate",
				// Animations from your provided tailwind.config
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"glow": "glow 2s ease-in-out infinite alternate",
				"fade-in": "fade-in 0.6s ease-out",
				"slide-up": "slide-up 0.6s ease-out",
			},
		},
	},
	// Add Tailwind plugins here
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
