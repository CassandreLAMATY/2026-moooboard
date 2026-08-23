// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/scss/main.scss"],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/scss/default/_fonts.scss" as *;',
                },
            },
        },
    },
    runtimeConfig: {
        appName: process.env.APP_NAME,
        appEmail: process.env.APP_EMAIL,
        backendBaseUrl: process.env.BACKEND_BASE_URL,
        nodeEnv: process.env.NODE_ENV,
        public: {
            site: {
                url: "https://moooboard.kodurooo.com",
                name: "MoooBoard by Studio Kodurooo",
            },
        },
    },
});
