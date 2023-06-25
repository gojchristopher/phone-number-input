import { Box } from "@chakra-ui/react";
import { PhoneNumberInput } from "./PhoneNumberInput";

export default function App() {
	return (
		<Box
			p={{
				base: 8,
				md: 12,
				lg: 16,
			}}
		>
			<PhoneNumberInput />
		</Box>
	);
}
