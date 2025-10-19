import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles: {
    global: () => ({
      body: { bg: "gray.50", color: "gray.800" },
    }),
  },
  colors: {
    brand: {
      // Updated primary palette (Bootstrap-esque blue). Requested primary: #0d6efd at 500.
      // To revert: replace this block with previous red scale (saved in VCS) where 500 was #FF4438.
      50: "#e7f1ff",
      100: "#c2dcff",
      200: "#9cc5ff",
      300: "#75adff",
      400: "#4f94fe",
      500: "#0d6efd", // Primary
      600: "#0b5edb",
      700: "#094bb0",
      800: "#073985",
      900: "#052a63",
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Badge: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: "brand.500",
        },
      },
    },
  },
});
