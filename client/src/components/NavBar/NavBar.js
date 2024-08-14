import { Divider, Flex, Heading } from "@chakra-ui/react";
import ToggleTheme from "./ToggleTheme";
import {Link} from 'react-router-dom';

export default function NavBar() {
    return(
        <>
        <Flex padding="1rem" justifyContent="space-between">
            <Heading><Link to="/">SiteName</Link></Heading>
            <Flex>
                <ToggleTheme/>
            </Flex>
        </Flex>
        <Divider marginBottom="2em" />
        </>
    )
}