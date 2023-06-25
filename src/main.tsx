import { Box, ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { PhoneNumberInput } from "./PhoneNumberInput";

createRoot(document.getElementById("root") as HTMLElement).render(
	<ChakraProvider>
		<Box
			p={{
				base: 8,
				md: 12,
				lg: 16,
			}}
		>
			<PhoneNumberInput />
		</Box>
	</ChakraProvider>,
);
