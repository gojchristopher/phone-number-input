import { useControllableState } from "@chakra-ui/react";
import { parsePhoneNumber } from "awesome-phonenumber";
import * as React from "react";
import { countries } from "./countries";
import { mergeRefs } from "./mergeRefs";
import { usePopper } from "./usePopper";

export interface UsePhoneNumberInputProps {
	value?: string;
	onChange?(newValue: string): void;
	defaultValue?: string;
}

type TItem = (typeof countries)[number];
type AnyProps = Record<string, any>;
type HtmlDivProps = React.ComponentPropsWithRef<"div"> & AnyProps;
type HtmlInputProps = React.ComponentPropsWithRef<"input"> & AnyProps;
type HtmlButtonProps = React.ComponentPropsWithRef<"button"> & AnyProps;

const PHONENUMBER_PREFIX = "+";

export function usePhoneNumberInput(props: UsePhoneNumberInputProps) {
	const [value, onChange] = useControllableState({
		value: props.value,
		onChange: props.onChange,
		defaultValue: props.defaultValue ?? "",
	});

	const popper = usePopper();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [regionCode, setRegionCode] = React.useState("");

	const getRootProps = (userProps: HtmlDivProps = {}): HtmlDivProps => {
		return {
			...userProps,

			ref: userProps.ref
				? mergeRefs([userProps.ref, popper.refs.setPositionReference])
				: popper.refs.setPositionReference,

			"data-focus": popper.isOpen || undefined,
		};
	};

	const getReferenceProps = (userProps: HtmlButtonProps = {}): HtmlButtonProps => {
		return popper.getReferenceProps({
			ref: userProps.ref
				? mergeRefs([userProps.ref, popper.refs.setReference])
				: popper.refs.setReference,

			"aria-autocomplete": "none",
		});
	};

	const getFloatingProps = (userProps: HtmlDivProps = {}) => {
		return popper.getFloatingProps({
			...userProps,

			ref: userProps.ref
				? mergeRefs([userProps.ref, popper.refs.setFloating])
				: mergeRefs([popper.refs.setFloating]),

			style: {
				...userProps.style,
				...popper.styles,

				top: `${popper.y}px`,
				left: `${popper.x}px`,
				position: popper.strategy,
			},
		});
	};

	const getItemProps = ({
		item,
		index,
		...userProps
	}: HtmlDivProps & { item: TItem; index: number }): HtmlDivProps => {
		const localRef = (node: HTMLDivElement) => {
			popper.listRef.current[index] = node;
		};

		function handleSelect() {
			setRegionCode(item.code);

			popper.setOpen(false);
			popper.setActiveIndex(null);

			onChange(PHONENUMBER_PREFIX + item.areaCode);
			inputRef.current?.focus();
		}

		return popper.getItemProps({
			...userProps,

			ref: userProps.ref ? mergeRefs([userProps.ref, localRef]) : localRef,
			role: "option",
			tabIndex: index === popper.activeIndex ? 0 : -1,
			onClick(e: React.MouseEvent<HTMLDivElement>) {
				handleSelect();
				userProps.onClick?.(e);
			},
			onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
				if (e.key === "Enter") {
					e.preventDefault();

					handleSelect();
					userProps.onKeyDown?.(e);
				}
			},
			"aria-selected": popper.activeIndex === index || undefined,
		});
	};

	const getInputProps = (userProps: HtmlInputProps = {}): HtmlInputProps => ({
		...userProps,

		ref: userProps.ref ? mergeRefs([inputRef, userProps.ref]) : inputRef,

		value,
		onChange(e) {
			const parsed = parsePhoneNumber(e.target.value, {
				regionCode,
			});

			if (parsed.number) {
				onChange(parsed.number.international);
			}

			userProps.onChange?.(e);
		},
	});

	return {
		...popper,

		value,
		onChange,
		regionCode,
		setRegionCode,
		getRootProps,
		getItemProps,
		getFloatingProps,
		getInputProps,
		getReferenceProps,
	};
}
