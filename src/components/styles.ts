import { chakra } from "@chakra-ui/react";

export const Options = chakra("div", {
  baseStyle: {
    bg: "white",
    border: "1px",
    borderColor: "neutrals.200",
    rounded: "lg",
    zIndex: "modal",
    overflow: "hidden",
  },
});

export const OptionsInner = chakra("div", {
  baseStyle: {
    maxH: "492px",
    maxW: "315px",
    overflowY: "auto",
    borderColor: "gray.200",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "8px",

      border: "6px solid",
      borderColor: "#EAECF0",
      backgroundClip: "padding-box",
    },
    "&::-webkit-scrollbar-track-piece": {
      rounded: "full",
      bgColor: "transparent",
      border: "6px solid",
      borderColor: "transparent",
      backgroundClip: "padding-box",
    },
    "&::-webkit-scrollbar-track": {
      bgColor: "transparent",
    },
  },
});

export const Option = chakra("div", {
  baseStyle: {
    px: 3,
    py: 2,
    cursor: "pointer",
    fontSize: "sm",
    _selected: {
      bg: "Gray.50",
    },
  },
});
