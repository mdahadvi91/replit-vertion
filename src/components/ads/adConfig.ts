export const adConfig = {
  clientId: (import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined)?.trim() ?? '',
  homeSlot: (import.meta.env.VITE_ADSENSE_HOME_SLOT as string | undefined)?.trim() ?? '',
  toolSlot: (import.meta.env.VITE_ADSENSE_TOOL_SLOT as string | undefined)?.trim() ?? '',
  librarySlot: (import.meta.env.VITE_ADSENSE_LIBRARY_SLOT as string | undefined)?.trim() ?? '',
  // Ads are only considered configured when every placement has a slot.
  enabled: Boolean(
    import.meta.env.VITE_ADSENSE_CLIENT_ID &&
      import.meta.env.VITE_ADSENSE_HOME_SLOT &&
      import.meta.env.VITE_ADSENSE_TOOL_SLOT &&
      import.meta.env.VITE_ADSENSE_LIBRARY_SLOT,
  ),
};
