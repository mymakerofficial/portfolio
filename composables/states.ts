import { useState } from "nuxt/app";

export const useColorMode = () => useState<'dark' | 'light'>('colorMode', () => 'dark');