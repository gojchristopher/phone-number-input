import { useControllableState } from "@chakra-ui/react";
import { parsePhoneNumber } from "awesome-phonenumber";
import * as React from "react";
import { countries } from "./countries";
import { mergeRefs } from "./mergeRefs";
import { usePopper } from "./usePopper";

interface Option {
	label: string;
	value: string;
}

type Matcher = (option: Option, keyword: string) => boolean;

export interface UsePhoneNumberInputProps {
	value?: string;
	onChange?(newValue: string): void;
	defaultValue?: string;
	options?: Option[];
	matcher?: Matcher;
}

type TItem = (typeof countries)[number];
type HtmlDivProps = React.ComponentPropsWithRef<"div">;
type HtmlInputProps = React.ComponentPropsWithRef<"input">;

export function usePhoneNumberInput({
	options = [],
	matcher = (option, kw) => {
		return option.label.toLowerCase().includes(kw.toLowerCase().trim());
	},
	...props
}: UsePhoneNumberInputProps) {
	const [value, onChange] = useControllableState({
		value: props.value,
		onChange: props.onChange,
		defaultValue: props.defaultValue ?? "",
	});

	const items = options.filter((option) => matcher(option, value));

	const popper = usePopper();

	const inputRef = React.useRef<HTMLInputElement>(null);
	const [regionCode, setRegionCode] = React.useState<string>();

	const getFloatingProps = (props: HtmlDivProps = {}) =>
		popper.getFloatingProps({
			...props,

			ref: mergeRefs(props.ref, popper.refs.setFloating),

			style: {
				...props.style,
				...popper.styles,

				top: `${popper.y}px`,
				left: `${popper.x}px`,
				position: popper.strategy,
			},
		});

	const getItemProps = ({
		item,
		index,
		...props
	}: HtmlDivProps & { item: TItem; index: number }): HtmlDivProps =>
		popper.getItemProps({
			...props,

			ref: mergeRefs(props.ref, (node: HTMLDivElement) => {
				popper.listRef.current[index] = node;
			}),

			onClick(e: React.MouseEvent<HTMLDivElement>) {
				setRegionCode(item.code);

				popper.setOpen(false);
				popper.setActiveIndex(null);

				inputRef.current?.focus();
				onChange(prefix + item.areaCode);
				props.onClick?.(e);
			},

			"aria-selected": popper.activeIndex === index || undefined,
		});

	const getInputProps = (props: HtmlInputProps = {}): HtmlInputProps => ({
		...props,

		value,
		onChange(e) {
			const parsed = parsePhoneNumber(e.target.value, {
				regionCode,
			});

			if (parsed.number) {
				onChange(parsed.number.international);
			}

			props.onChange?.(e);
		},
	});

	const getRootProps = (props: HtmlDivProps = {}): HtmlDivProps => ({
		...props,

		/* TODO: merge virtual ref */
		ref: popper.refs.setPositionReference,
	});

	return {
		...popper,

		items,
		value,
		onChange,
		regionCode,
		setRegionCode,
		getRootProps,
		getItemProps,
		getFloatingProps,
		getInputProps,
	};
}

const prefix = "+";
