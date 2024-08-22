import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  useToast,
  Heading,
  HStack,
  VStack,
  Box,
  Text,
  Flex,
  Grid,
  Tag,
  TagLabel,
  TagCloseButton,
  useColorModeValue,
  Container,
  Skeleton,
  Avatar,
} from '@chakra-ui/react';
import { CalendarIcon, InfoIcon, TimeIcon } from '@chakra-ui/icons';
import PositionCard from './PositionCard';

const requestServer = 'http://localhost:8080/';

function EventDetails() {
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [isApprover, setIsApprover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [uniquePositions, setUniqePositions] = useState(null)
  const [positionColors, setPositionColors] = useState(null)
  const [eventUsers, setEventUsers] = useState(null)
  const toast = useToast();

  const cardBgColor = useColorModeValue('white', 'gray.600');
  const togglePosition = (name) => {
    setSelectedPositions(prev => 
      prev.includes(name)
        ? prev.filter(p => p !== name)
        : [...prev, name]
    );
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const eventResponse = await fetch
        (`${requestServer}events/?id=${id}`, {
            method: "GET",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
          })
        const userResponse = await fetch
        (`${requestServer}users/self`, {
            method: "GET",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
          });
        const eventData = await eventResponse.json();
        const userData = await userResponse.json();

        //console.log('fetch event Data: ', eventData)
        setEventInfo(eventData[0]);
        setIsApprover(userData[0].isApprover);
        setCurrentUser(userData[0]);
        setIsLoading(false);
        let eUsers = eventData[0].position.map(pos=>{
          return {
            name: pos.victim,
            id: pos['user_id']
          }
        })
        setEventUsers(eUsers)
        let upos =eventData[0].position.map(pos => pos.name)
        //console.log(upos)
        setUniqePositions(upos)

        setPositionColors(() => {
          const colors = {};
          // //console.log('positionColor: ', upos)
          upos.forEach(pos => {
            colors[pos] = stringToColor(pos);
          });
          return colors;
        })
        

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch event data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <Container maxW="container.xl" p={4}>
        <VStack spacing={4} align="stretch">
          <Skeleton height="40px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </VStack>
      </Container>
    );
  }
  
    
  return (
    <Container maxW="container.xl" p={4}>
      <VStack spacing={8} align="stretch">
        {eventInfo && (
          <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
            <VStack align="stretch" spacing={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md">{eventInfo.name}</Heading>
              </Flex>
              <HStack>
                <InfoIcon />
                <Text><strong>Location:</strong> {eventInfo.location}</Text>
              </HStack>
              <HStack>
                <InfoIcon />
                <Text><strong>POC Info:</strong> {eventInfo.POCinfo}</Text>
              </HStack>
              <HStack>
                <CalendarIcon />
                <Text><strong>Date:</strong> {eventInfo.startDate} - {eventInfo.endDate}</Text>
              </HStack>
              <HStack>
                <TimeIcon />
                <Text><strong>Time:</strong> {eventInfo.startTime} - {eventInfo.endTime}</Text>
              </HStack>
              <Text><strong>Description:</strong> {eventInfo.description}</Text>
              <Text><strong>Type:</strong> {eventInfo.type}</Text>
              <Text><strong>Status:</strong> {eventInfo.approved ? 'Approved' : 'Pending'}</Text>
            </VStack>
          </Box>
        )}

        {uniquePositions.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>Filter by position:</Text>
            <Flex wrap="wrap" gap={2}>
              {uniquePositions.map((pos) => (
                <Tag
                  key={pos}
                  size="lg"
                  variant={selectedPositions.includes(pos) ? "solid" : "outline"}
                  colorScheme={positionColors[pos]}
                  cursor="pointer"
                  onClick={() => togglePosition(pos)}
                >
                  <TagLabel>{pos}</TagLabel>
                  {selectedPositions.includes(pos) && <TagCloseButton />}
                </Tag>
              ))}
            </Flex>
          </Box>
        )}

        <Heading size="md">position</Heading>
        {/* {console.log('event user info: ', eventInfo.position[0])} */}
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {
          eventInfo.position.filter(pos => selectedPositions.length === 0 || selectedPositions.includes(pos.name))
            .map(pos => (
              <PositionCard
                key={pos.id}
                position={pos}
                currentUser={currentUser}
                isApprover={isApprover}
                eventUsers={eventUsers}
                positionColors={positionColors}
                eventId={id}
                eventStartDate={eventInfo.startDate}
                eventEndDate={eventInfo.endDate}
                eventStartTime={eventInfo.startTime}
                eventEndTime={eventInfo.endTime}
                onUpdateEvent={(updatedEvent) => setEventInfo(updatedEvent)}
              />
            ))}
        </Grid>

        {eventInfo && eventInfo.approver && (
          <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
            <Heading size="sm" mb={4}>Approver</Heading>
            <HStack>
              <Avatar size="sm" name={eventInfo.approver[0].name} />
              <Text>{eventInfo.approver[0].name}</Text>
              <Tag size="sm" colorScheme="blue">
                <TagLabel>{eventInfo.approver[0].rank}</TagLabel>
              </Tag>
            </HStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

export default EventDetails;