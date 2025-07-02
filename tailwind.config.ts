import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#000000',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#f8f8f8',
					foreground: '#1a1a1a'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: '#f8f8f8',
					foreground: '#666666'
				},
				accent: {
					DEFAULT: '#4a90e2',
					foreground: '#ffffff'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#000000'
				},
				charcoal: '#1a1a1a',
				'dark-gray': '#333333',
				'medium-gray': '#666666',
				'light-gray': '#cccccc',
				'off-white': '#f8f8f8',
				
				// Futuristic Color Palette
				'neon-blue': 'hsl(var(--neon-blue))',
				'neon-purple': 'hsl(var(--neon-purple))',
				'neon-pink': 'hsl(var(--neon-pink))',
				'neon-green': 'hsl(var(--neon-green))',
				'neon-orange': 'hsl(var(--neon-orange))',
				'neon-cyan': 'hsl(var(--neon-cyan))',
				
				// Glassmorphism
				'glass-bg': 'hsl(var(--glass-bg))',
				'glass-border': 'hsl(var(--glass-border))',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
				'display': ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'hero': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'section': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
				'subsection': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
				'card-title': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
				'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
				'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
				'body-sm': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
				'caption': ['12px', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.5px' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
			},
			boxShadow: {
				'card': '0 2px 4px rgba(0,0,0,0.1)',
				'card-hover': '0 4px 12px rgba(0,0,0,0.15)',
				'header': '0 1px 3px rgba(0,0,0,0.1)',
				'neon-blue': '0 0 20px rgba(102, 126, 234, 0.5)',
				'neon-purple': '0 0 20px rgba(118, 75, 162, 0.5)',
				'neon-pink': '0 0 20px rgba(240, 147, 251, 0.5)',
				'neon-green': '0 0 20px rgba(34, 197, 94, 0.5)',
				'neon-orange': '0 0 20px rgba(251, 146, 60, 0.5)',
				'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.5)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
				'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
			},
			backdropBlur: {
				'xs': '2px',
				'sm': '4px',
				'md': '8px',
				'lg': '12px',
				'xl': '16px',
				'2xl': '24px',
				'3xl': '40px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'glitch-1': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' }
				},
				'glitch-2': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(2px, -2px)' },
					'40%': { transform: 'translate(2px, 2px)' },
					'60%': { transform: 'translate(-2px, -2px)' },
					'80%': { transform: 'translate(-2px, 2px)' }
				},
				'holographic': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'typewriter': {
					from: { width: '0' },
					to: { width: '100%' }
				},
				'blink-caret': {
					'from, to': { borderColor: 'transparent' },
					'50%': { borderColor: 'currentColor' }
				},
				'morph': {
					'0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
					'50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }
				},
				'particles': {
					'0%, 100%': { transform: 'scale(1) rotate(0deg)' },
					'50%': { transform: 'scale(1.1) rotate(180deg)' }
				},
				'slide-in-left': {
					'0%': {
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-in-top': {
					'0%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-in-bottom': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'fade-in-up': {
					'0%': {
						transform: 'translateY(30px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'fade-in-down': {
					'0%': {
						transform: 'translateY(-30px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'rotate-in': {
					'0%': {
						transform: 'rotate(-200deg)',
						opacity: '0'
					},
					'100%': {
						transform: 'rotate(0)',
						opacity: '1'
					}
				},
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)'
					},
					'70%': {
						transform: 'scale(0.9)'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				},
				'pulse-fast': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'gradient-shift': 'gradient-shift 15s ease infinite',
				'gradient-shift-slow': 'gradient-shift 20s ease infinite',
				'float': 'float 6s ease-in-out infinite',
				'glitch-1': 'glitch-1 2s infinite linear alternate-reverse',
				'glitch-2': 'glitch-2 3s infinite linear alternate-reverse',
				'holographic': 'holographic 3s ease-in-out infinite',
				'typewriter': 'typewriter 3s steps(40, end)',
				'blink-caret': 'blink-caret 0.75s step-end infinite',
				'morph': 'morph 8s ease-in-out infinite',
				'particles': 'particles 20s ease-in-out infinite',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'slide-in-top': 'slide-in-top 0.6s ease-out',
				'slide-in-bottom': 'slide-in-bottom 0.6s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in-down': 'fade-in-down 0.6s ease-out',
				'rotate-in': 'rotate-in 0.8s ease-out',
				'bounce-in': 'bounce-in 0.8s ease-out',
				'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'pulse-fast': 'pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-futuristic': 'var(--gradient-futuristic)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
