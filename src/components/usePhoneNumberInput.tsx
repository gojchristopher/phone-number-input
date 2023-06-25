import {
  autoUpdate,
  useFloating,
  offset,
  flip,
  shift,
  size,
  useRole,
  useDismiss,
  useListNavigation,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import { useControllableState } from "@chakra-ui/react";
import { useRef, useState } from "react";

export interface Option {
  label: string;
  value: string;
}

export type Matcher = (option: Option, keyword: string) => boolean;

export interface UseComboboxProps {
  value?: string;
  onChange?(newValue: string): void;
  options?: Option[];
  matcher?: Matcher;
}

function usePhoneNumberInput(props: UseComboboxProps) {
  const [inputValue, setInputValue] = useControllableState({
    ...props,
    defaultValue: "",
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setOpen] = useState(false);

  const floating = useFloating({
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
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });

  const role = useRole(floating.context, { role: "listbox" });
  const dismiss = useDismiss(floating.context);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const listNav = useListNavigation(floating.context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    // virtual: true,
    loop: true,
  });

  const interactions = useInteractions([role, dismiss, listNav]);

  const transition = useTransitionStyles(floating.context, {
    duration: {
      open: 100,
      close: 50,
    },
  });

  const items = props.options?.filter((option) => {
    return props.matcher?.(option, inputValue);
  });

  return {
    ...floating,
    ...interactions,
    ...transition,

    items,
    isOpen,
    setOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    listRef,
  };
}

export default usePhoneNumberInput;
