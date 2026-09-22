export const adConfig = {
  clientId: (import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined) ?? '',
  homeSlot: (import.meta.env.VITE_ADSENSE_HOME_SLOT as string | undefined) ?? '',
  toolSlot: (import.meta.env.VITE_ADSENSE_TOOL_SLOT as string | undefined) ?? '',
  enabled: Boolean(import.meta.env.VITE_ADSENSE_CLIENT_ID),
};
