import { Avatar, Flex, HTMLChakraProps, chakra, forwardRef } from "@chakra-ui/react";
import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";
import { Assign } from "./types";
import { UsePhoneNumberInputProps, usePhoneNumberInput } from "./usePhoneNumberInput";
import { isScrolledToBottom, usePaginatedCountries } from "./utils";

export interface PhoneNumberInputProps
	extends Assign<HTMLChakraProps<"input">, UsePhoneNumberInputProps> {}

export const PhoneNumberInput = forwardRef<PhoneNumberInputProps, "input">(
	({ value, onChange, defaultValue }, ref) => {
		const numberInput = usePhoneNumberInput({
			value,
			onChange,
			defaultValue,
		});

		const popupRef = useRef<HTMLDivElement>(null);
		const paginated = usePaginatedCountries(numberInput.isOpen);

		useEffect(() => {
			const div = popupRef.current;

			if (!div) return;

			const handleScroll = () => {
				if (isScrolledToBottom(div)) {
					paginated.more();
				}
			};

			popupRef.current?.addEventListener("scroll", handleScroll);

			return () => {
				div.removeEventListener("scroll", handleScroll);
			};
		}, [paginated]);

		return (
			<>
				<chakra.div
					display="flex"
					border="1px"
					borderColor="gray.200"
					rounded="lg"
					overflow="hidden"
					transition="all 250ms ease-in-out"
					_focus={{
						borderColor: "blue.300",
					}}
					_focusWithin={{
						borderColor: "blue.300",
					}}
					data-group
					{...numberInput.getRootProps()}
				>
					<chakra.button
						w="75px"
						px={3}
						gap="6px"
						display="flex"
						alignSelf="stretch"
						alignItems="center"
						outline="none"
						cursor="pointer"
						borderRight="1px"
						borderColor="gray.200"
						transition="all 250ms ease-in-out"
						_groupFocus={{
							borderColor: "blue.300",
						}}
						_groupFocusWithin={{
							borderColor: "blue.300",
						}}
						{...numberInput.getReferenceProps()}
					>
						<chakra.span flexGrow={1} fontSize="16px" lineHeight="24px">
							{numberInput.regionCode || "Code"}
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
						flexGrow={1}
						_placeholder={{
							color: "gray.400",
						}}
						placeholder="Enter Phone Number"
						{...numberInput.getInputProps({ ref })}
					/>
				</chakra.div>

				<FloatingPortal>
					{numberInput.isMounted && (
						<FloatingFocusManager
							context={numberInput.context}
							returnFocus={false}
							initialFocus={-1}
							modal={false}
							visuallyHiddenDismiss
						>
							<chakra.div
								w="315px"
								bg="white"
								border="1px"
								borderColor="gray.200"
								rounded="lg"
								overflowY="auto"
								zIndex="modal"
								outline="none"
								scrollBehavior="smooth"
								{...numberInput.getFloatingProps({
									ref: popupRef,
								})}
							>
								{paginated.rows.map((item, index) => {
									return (
										<Flex
											key={item.code}
											py={2}
											px={3}
											gap={2}
											cursor="pointer"
											alignItems="center"
											outline="none"
											_selected={{
												bg: "gray.50",
											}}
											{...numberInput.getItemProps({
												item,
												index,
											})}
										>
											<Avatar src={item.flag} name={item.name} size="xs" />

											<chakra.span
												pr={4}
												fontSize="14px"
												color="gray.900"
												flexGrow={1}
												lineHeight="normal"
											>
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
