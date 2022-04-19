const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	
  plugins: [
	require('@tailwindcss/typography'),
	require("daisyui")
  ],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: ["garden"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};

module.exports = config;
