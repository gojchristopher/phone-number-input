import { useControllableState } from "@chakra-ui/react";
import {
	autoUpdate,
	flip,
	offset,
	shift,
	size,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useListNavigation,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import { useRef, useState } from "react";

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

	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [isOpen, setOpen] = useState(false);

	const floating = useFloating<HTMLInputElement>({
		open: isOpen,
		onOpenChange: setOpen,
		strategy: "fixed",
		placement: "bottom-start",
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(4),
			flip(),
			shift({
				padding: 4,
			}),
			size({
				padding: 16,
				apply({ availableHeight, elements }) {
					Object.assign(elements.floating.style, {
						maxHeight: `${availableHeight}px`,
					});
				},
			}),
		],
	});

	const role = useRole(floating.context, { role: "listbox" });
	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const listRef = useRef<Array<HTMLElement | null>>([]);
	const listNav = useListNavigation(floating.context, {
		listRef,
		activeIndex,
		onNavigate: setActiveIndex,
		virtual: true,
		loop: true,
	});

	const interactions = useInteractions([role, dismiss, click, listNav]);

	const transition = useTransitionStyles(floating.context, {
		duration: {
			open: 100,
			close: 50,
		},
	});

	const items = options.filter((option) => {
		return matcher(option, value);
	});

	return {
		...floating,
		...interactions,
		...transition,

		items,
		isOpen,
		setOpen,
		value,
		onChange,
		activeIndex,
		setActiveIndex,
		listRef,
	};
}
