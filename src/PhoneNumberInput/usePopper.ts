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
import * as React from "react";

export function usePopper() {
	const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
	const [isOpen, setOpen] = React.useState(false);

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
	const listRef = React.useRef<(HTMLElement | null)[]>([]);
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

	return {
		...floating,
		...interactions,
		...transition,

		isOpen,
		setOpen,
		activeIndex,
		setActiveIndex,
		listRef,
	};
}
