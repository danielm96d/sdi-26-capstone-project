import { Avatar, ButtonGroup, Center, Divider, Flex, Heading, IconButton, Stack } from "@chakra-ui/react";
import ToggleTheme from "./ToggleTheme";
import { Link } from 'react-router-dom';
import { HamburgerIcon } from "@chakra-ui/icons";
import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Text } from "@chakra-ui/react";
import { useRef } from "react";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  return (
    <>
      <Flex padding="1rem" justifyContent="space-between">
        <Heading><Link to="/">PlaceHolder</Link></Heading>
        <Flex>
          <IconButton onClick={onOpen} ref={btnRef} isRound={true} icon={<HamburgerIcon />} />
        </Flex>
      </Flex>
      <Divider marginBottom="2em" />
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Avatar />
            <Heading marginTop="1em" size="xs">Rank Name (role)</Heading>
          </DrawerHeader>

          <DrawerBody>
            <Divider marginBottom="1em" />
            <Center>
              <ButtonGroup variant="ghost">
                <Stack spacing={10}>
                  <Button>Home</Button>
                  <Button>Calender</Button>
                  <Button>Approval</Button>
                  <Button>Create Event</Button>
                  <Button>Logout</Button>
                  <ToggleTheme />
                </Stack>
              </ButtonGroup>
            </Center>
          </DrawerBody>

          <DrawerFooter>
            <Text>Extra information maybe unit name??</Text>
            {/* <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button> */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}