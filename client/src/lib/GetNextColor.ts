

import { COLORS_ARRAY } from "@/constant";

export const getRandomColor = (): string => {
    return COLORS_ARRAY[Math.floor(Math.random() * COLORS_ARRAY.length)];
};