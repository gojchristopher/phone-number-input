import { Avatar, Flex, HTMLChakraProps, chakra, forwardRef } from "@chakra-ui/react";
import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { countries } from "./countries";
import { Assign } from "./types";
import { UsePhoneNumberInputProps, usePhoneNumberInput } from "./usePhoneNumberInput";

export interface PhoneNumberInputProps
	extends Assign<HTMLChakraProps<"input">, UsePhoneNumberInputProps> {}

export const PhoneNumberInput = forwardRef<PhoneNumberInputProps, "input">(
	({ value, onChange, defaultValue, matcher, options }, ref) => {
		const numberInput = usePhoneNumberInput({
			value,
			onChange,
			defaultValue,
			matcher,
			options,
		});

		return (
			<>
				<chakra.div
					display="flex"
					border="1px"
					borderColor="gray.200"
					rounded="lg"
					overflow="hidden"
					transition="all 250ms ease-in-out"
					_focusWithin={{
						borderColor: "blue.300",
					}}
					{...numberInput.getRootProps()}
				>
					<chakra.button
						w="80px"
						px={3}
						bg="gray.50"
						gap="6px"
						display="flex"
						alignSelf="stretch"
						alignItems="center"
						outline="none"
						{...numberInput.getReferenceProps()}
					>
						<chakra.span flexGrow={1} fontSize="16px" lineHeight="24px">
							{numberInput.regionCode ?? "Code"}
						</chakra.span>
						<chakra.svg
							as={ChevronDownIcon}
							w={4}
							h={4}
							flexShrink={0}
							transition="all 250ms ease-in-out"
							transform={numberInput.isOpen ? "rotate(180deg)" : undefined}
						/>
					</chakra.button>

					<chakra.input
						px={2}
						py={3}
						outline="none"
						_placeholder={{
							color: "gray.400",
						}}
						placeholder="Enter Phone Number"
						{...numberInput.getInputProps({ ref })}
					/>
				</chakra.div>

				<FloatingPortal>
					{numberInput.isOpen && (
						<FloatingFocusManager
							context={numberInput.context}
							initialFocus={-1}
							visuallyHiddenDismiss
							returnFocus={false}
						>
							<chakra.div
								bg="white"
								border="1px"
								borderColor="gray.200"
								rounded="lg"
								maxW="315px"
								overflowY="auto"
								zIndex="modal"
								{...numberInput.getFloatingProps()}
							>
								{countries.slice(0, 25).map((item, index) => {
									return (
										<Flex
											key={item.code}
											w="full"
											py={2}
											px={3}
											gap={2}
											cursor="pointer"
											alignItems="center"
											{...numberInput.getItemProps({
												item,
												index,
											})}
										>
											<Avatar src={item.flag} name={item.name} size="xs" />

											<chakra.span pr={4} fontSize="14px" color="gray.900" flexGrow={1}>
												{item.name} (+{item.areaCode})
											</chakra.span>

											{numberInput.regionCode === item.code && (
												<chakra.svg as={CheckCircleIcon} color="green.400" w={4} h={4} />
											)}
										</Flex>
									);
								})}
							</chakra.div>
						</FloatingFocusManager>
					)}
				</FloatingPortal>
			</>
		);
	},
);

PhoneNumberInput.displayName = "PhoneNumberInput";
