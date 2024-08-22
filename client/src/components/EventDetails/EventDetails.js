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

function EventDetails() {
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [isApprover, setIsApprover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const toast = useToast();

  const cardBgColor = useColorModeValue('white', 'gray.600');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventResponse, userResponse] = await Promise.all([
          fetch(`${requestServer}events/?id=${id}`, {
            method: "GET",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${requestServer}users/self`, {
            method: "GET",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
          })
        ]);

        const eventData = await eventResponse.json();
        const userData = await userResponse.json();

        setEventInfo(eventData[0]);
        setIsApprover(userData[0].isApprover);
        setCurrentUser(userData[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch event data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const togglePosition = (positionName) => {
    setSelectedPositions(prev => 
      prev.includes(positionName)
        ? prev.filter(p => p !== positionName)
        : [...prev, positionName]
    );
  };

  const uniquePositions = useMemo(() => {
    if (!eventInfo || !eventInfo.positions) return [];
    return [...new Set(eventInfo.positions.map(pos => pos.positionName))];
  }, [eventInfo]);

  const positionColors = useMemo(() => {
    const colors = {};
    uniquePositions.forEach(pos => {
      colors[pos] = stringToColor(pos);
    });
    return colors;
  }, [uniquePositions]);

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
            <Text fontWeight="bold" mb={2}>Filter by Position:</Text>
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

        <Heading size="md">Positions</Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {eventInfo && eventInfo.positions && eventInfo.positions
            .filter(pos => selectedPositions.length === 0 || selectedPositions.includes(pos.positionName))
            .map(pos => (
              <PositionCard
                key={pos.id}
                positions={pos}
                currentUser={currentUser}
                isApprover={isApprover}
                eventUsers={eventInfo.users}
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