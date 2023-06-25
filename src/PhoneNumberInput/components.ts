import { chakra } from "@chakra-ui/react";

export const Options = chakra("div", {
	baseStyle: {
		bg: "white",
		border: "1px",
		borderColor: "gray.200",
		rounded: "lg",
		maxW: "315px",
		overflowY: "auto",
		zIndex: "modal",
	},
});

export const Option = chakra("div", {
	baseStyle: {
		px: 3,
		py: 2,
		cursor: "pointer",
		fontSize: "sm",
		_selected: {
			bg: "gray.50",
		},
	},
});
