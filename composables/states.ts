import { useState } from "nuxt/app";

export const useColorScheme = () => useState<'dark' | 'light'>('colorScheme', () => 'dark');