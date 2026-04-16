export { HeroSplitLayout } from "./HeroSplitLayout";
export { HeroCenteredLayout } from "./HeroCenteredLayout";
export { HeroBackgroundLayout } from "./HeroBackgroundLayout";
export { HeroCardOverlayLayout } from "./HeroCardOverlayLayout";

import type { HeroSectionWithLayout } from "@/types/admin";
import { HeroSplitLayout } from "./HeroSplitLayout";
import { HeroCenteredLayout } from "./HeroCenteredLayout";
import { HeroBackgroundLayout } from "./HeroBackgroundLayout";
import { HeroCardOverlayLayout } from "./HeroCardOverlayLayout";

export type HeroLayoutComponent = React.ComponentType<{
    content: HeroSectionWithLayout;
    config: Record<string, any>;
    lang: string;
    onNavigate: (to: string) => void;
}>;

export const heroLayoutMap: Record<string, HeroLayoutComponent> = {
    "split-left-image-right": HeroSplitLayout,
    "centered-minimal": HeroCenteredLayout,
    "full-background": HeroBackgroundLayout,
    "card-overlay": HeroCardOverlayLayout,
};

export const getHeroLayout = (layoutKey: string | undefined): HeroLayoutComponent => {
    return heroLayoutMap[layoutKey || "split-left-image-right"] || HeroSplitLayout;
};
