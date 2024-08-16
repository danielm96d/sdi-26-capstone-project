import { Avatar, ButtonGroup, Center, Divider, Flex, Heading, IconButton, Skeleton, Stack } from "@chakra-ui/react";
import ToggleTheme from "./ToggleTheme";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HamburgerIcon } from "@chakra-ui/icons";
import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Text } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const location = useLocation();
  
  useAuth();
  useEffect(() => {
    if(localStorage.getItem('id')) {
      fetch(`http://localhost:8080/users?id=${localStorage.getItem("id")}`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
      },
      })
      .then(res => res.json())
      .then(json => setUserInfo(json))
    }
  }, [location, navigate, onOpen])


  return (
    <>
      <Flex padding="1rem" justifyContent="space-between">
        <Heading><Link to="/">OpSync</Link></Heading>
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
            <Avatar name={Object.keys(userInfo).length > 0  && !userInfo.invalid ? userInfo[0].name : ""} />
            <Heading marginTop="1em" size="xs">{Object.keys(userInfo).length > 0 && !userInfo.invalid ? `${userInfo[0].rank}  ${userInfo[0].name}` : <Skeleton/>}</Heading>
          </DrawerHeader>

          <DrawerBody>
            <Divider marginBottom="1em" />
            <Center>
              <ButtonGroup variant="ghost">
                <Stack spacing={10}>
                  <Button onClick={()=>{
                    onClose();
                    navigate("/profile")}}>Home</Button>
                  <Button onClick={()=>{
                    onClose();
                    navigate("/calendar")}}>Calendar</Button>
                  <Button>Approval</Button>
                  <Button onClick={()=>{
                    onClose();
                    navigate("/event-entry")}}>Create Event</Button>
                  <Button onClick={() => {
                    fetch('http://localhost:8080/logout', {
                      method: 'POST',
                      credentials: 'include'
                    })
                    .then(res => res.json())
                    .then(json => {
                      onClose();
                      localStorage.removeItem('id')
                      navigate('/login')
                    })
                  }}>Logout</Button>
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