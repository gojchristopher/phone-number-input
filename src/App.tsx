import { PhoneSelect } from "./components/PhoneNumberInput";
import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <Flex
      align="center"
      border="1px solid black"
      w="full"
      h="100vh"
      justify="center"
    >
      <Flex>
        <PhoneSelect />
      </Flex>
    </Flex>
  );
}

export default App;
