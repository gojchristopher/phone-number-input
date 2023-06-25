import { Avatar, Flex, HTMLChakraProps, chakra, forwardRef } from "@chakra-ui/react";
import { FloatingFocusManager, FloatingPortal, useMergeRefs } from "@floating-ui/react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { parsePhoneNumber } from "awesome-phonenumber";
import * as React from "react";
import { Options } from "./components";
import { countries } from "./countries";
import { Assign } from "./types";
import { UsePhoneNumberInputProps, usePhoneNumberInput } from "./usePhoneNumberInput";

export type PhoneNumberInputProps = Assign<
	HTMLChakraProps<"input">,
	UsePhoneNumberInputProps
>;

export const PhoneNumberInput = forwardRef<PhoneNumberInputProps, "input">(
	({ value, onChange, defaultValue, matcher, options }, ref) => {
		const numberInput = usePhoneNumberInput({
			value,
			onChange,
			defaultValue,
			matcher,
			options,
		});

		const inputRef = React.useRef<HTMLInputElement>(null);
		const mergedRef = useMergeRefs([ref, inputRef]);
		const [regionCode, setRegionCode] = React.useState<string>();

		return (
			<>
				<chakra.div
					ref={numberInput.refs.setPositionReference}
					display="flex"
					border="1px"
					borderColor="gray.200"
					rounded="lg"
					overflow="hidden"
					transition="all 250ms ease-in-out"
					_focusWithin={{
						borderColor: "blue.300",
					}}
				>
					<chakra.button
						ref={numberInput.refs.setReference}
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
							{regionCode ?? "Code"}
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
						ref={mergedRef}
						px={2}
						py={3}
						outline="none"
						_placeholder={{
							color: "gray.400",
						}}
						placeholder="Enter Phone Number"
						value={numberInput.value}
						onChange={(e) => {
							const parsed = parsePhoneNumber(e.target.value, { regionCode });

							if (parsed.number) {
								numberInput.onChange(parsed.number.international);
							}
						}}
					/>
				</chakra.div>

				<FloatingPortal>
					{numberInput.isOpen && (
						<FloatingFocusManager
							context={numberInput.context}
							initialFocus={-1}
							visuallyHiddenDismiss
						>
							<Options
								{...numberInput.getFloatingProps({
									ref: numberInput.refs.setFloating,
									style: {
										...numberInput.styles,

										top: numberInput.y + "px",
										left: numberInput.x + "px",
										position: numberInput.strategy,
									},
								})}
							>
								{countries.slice(0, 25).map(({ name, flag, code, areaCode }, index) => {
									const isSelected = numberInput.activeIndex === index;

									return (
										<Flex
											key={index}
											w="full"
											py="10px"
											px="14px"
											gap={2}
											cursor="pointer"
											alignItems="center"
											{...numberInput.getItemProps({
												key: code,

												ref(node) {
													numberInput.listRef.current[index] = node;
												},

												onClick() {
													setRegionCode(code);

													numberInput.onChange(`+${areaCode}`);
													numberInput.setOpen(false);
													numberInput.setActiveIndex(null);

													inputRef.current?.focus();
												},

												"aria-selected": isSelected || undefined,
											})}
										>
											<Avatar src={flag} name="" size="xs" />

											<chakra.span pr={4} fontSize="14px" color="gray.900" flexGrow={1}>
												{name} (+{areaCode})
											</chakra.span>

											{regionCode === code && (
												<chakra.svg as={CheckCircleIcon} color="green.400" w={4} h={4} />
											)}
										</Flex>
									);
								})}
							</Options>
						</FloatingFocusManager>
					)}
				</FloatingPortal>
			</>
		);
	},
);

PhoneNumberInput.displayName = "PhoneNumberInput";
