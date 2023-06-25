import {
  FloatingFocusManager,
  FloatingPortal,
  useMergeRefs,
} from "@floating-ui/react";
import {
  Flex,
  HTMLChakraProps,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  Text,
} from "@chakra-ui/react";
import { Options, OptionsInner } from "./styles";
import usePhoneNumberInput from "./usePhoneNumberInput";
import React from "react";
import { parsePhoneNumber } from "awesome-phonenumber";
import { Assign } from "../types";
import { country } from "../constants/country";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

interface selectBaseProps {
  value?: string;
  onChange?(newValue: string): void;
  containerStyle?: HTMLChakraProps<"div">;
}

export type selectProps = Assign<InputProps, selectBaseProps>;

export const PhoneSelect = React.forwardRef<HTMLInputElement, selectProps>(
  ({ value, onChange, containerStyle, ...others }, ref) => {
    const select = usePhoneNumberInput({
      value,
      onChange,
    });

    const [selectedPhone, setSelectedPhone] = React.useState("Code");
    const [isInvalidNumber, setIsInValidNumber] = React.useState(true);

    const inputRef = useMergeRefs([ref]);

    return (
      <React.Fragment>
        <InputGroup
          ref={select.refs.setReference}
          data-testid="web-admin.select"
          {...containerStyle}
        >
          <InputLeftAddon
            _hover={{ cursor: "pointer" }}
            gap="6px"
            onClick={() => select.setOpen(true)}
          >
            <Text fontSize="16px" lineHeight="24px">
              {selectedPhone}
            </Text>
            <Icon as={select.isOpen ? ChevronUpIcon : ChevronDownIcon} />
          </InputLeftAddon>

          <Input
            ref={inputRef}
            value={select.inputValue}
            isInvalid={!isInvalidNumber}
            _focus={{
              outline: "none",
              border: "brand.primary.900",
            }}
            fontSize="16px"
            lineHeight="24px"
            placeholder="Enter Phone Number"
            onChange={({ target: { value } }) => {
              const pNumber = parsePhoneNumber(value, {
                regionCode: selectedPhone,
              });
              setIsInValidNumber(!!value && pNumber.valid);
              if (pNumber.number && value)
                select.setInputValue(pNumber.number.international);
              onChange?.(select.inputValue);
            }}
            {...select.getReferenceProps({
              onKeyDown(event) {
                if (event.key === "Enter" && select.activeIndex != null) {
                  select.setActiveIndex(null);
                  select.setOpen(false);
                }
              },
            })}
            data-testid="web-admin.select.input"
            {...others}
          />
        </InputGroup>

        <FloatingPortal>
          {select.isOpen && (
            <FloatingFocusManager
              context={select.context}
              initialFocus={-1}
              visuallyHiddenDismiss
            >
              <Options
                ref={select.refs.setFloating}
                pos={select.strategy}
                top={select.y + "px"}
                left={select.x + "px"}
                style={select.styles}
                aria-label="select Options"
                data-testid="web-admin.select.options"
                {...select.getFloatingProps()}
              >
                <OptionsInner>
                  {country.map(
                    ({ name, flag, alpha2Code, callingCode }, index) => {
                      const isSelected = select.activeIndex === index;

                      const props = {
                        ...select.getItemProps({
                          key: alpha2Code,
                          ref: (node: HTMLDivElement) => {
                            select.listRef.current[index] = node;
                          },

                          onClick() {
                            const domRef = select.refs.domReference
                              .current as HTMLInputElement | null;

                            select.setInputValue(`+${callingCode}`);
                            select.setOpen(false);
                            setSelectedPhone(alpha2Code);
                            domRef?.focus();
                          },

                          "aria-label": alpha2Code,
                          "aria-selected": isSelected || undefined,
                        }),

                        "data-testid": "web-admin.select.option",
                      };

                      return (
                        <Flex
                          key={index}
                          {...props}
                          padding="10px 14px"
                          _hover={{
                            cursor: "pointer",
                            bg: "Neutrals.50",
                          }}
                          align="center"
                          justify="space-between"
                        >
                          <Flex w="full" align="center" gap="8px">
                            <Image
                              boxSize="24px"
                              src={flag}
                              alt=""
                              borderRadius="full"
                              overflow="hidden"
                              objectFit="cover"
                            />
                            <Text fontSize="14px" color="gray.900">
                              {name} (+{callingCode})
                            </Text>
                          </Flex>
                          {selectedPhone === alpha2Code && (
                            <Icon as={CheckIcon} />
                          )}
                        </Flex>
                      );
                    }
                  )}
                </OptionsInner>
              </Options>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </React.Fragment>
    );
  }
);

PhoneSelect.displayName = "PhoneSelect";
