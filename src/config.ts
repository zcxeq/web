export default {
  GITHUB_REPO: "odota/web",
  DISCORD_LINK: "opendota",
  VITE_API_HOST: import.meta.env.VITE_API_HOST || "https://api.opendota.com",
  VITE_IMAGE_CDN:
    import.meta.env.VITE_IMAGE_CDN || "https://cdn.cloudflare.steamstatic.com",
  VITE_ENABLE_RIVALRY: import.meta.env.VITE_ENABLE_RIVALRY,
  VITE_ENABLE_GOSUAI: import.meta.env.VITE_ENABLE_GOSUAI,
  // Мой аккаунт: его профиль открывается на главной
  MY_ACCOUNT_ID: import.meta.env.VITE_MY_ACCOUNT_ID || "380637483",
};
