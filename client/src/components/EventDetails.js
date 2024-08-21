import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  useToast,
  Heading,
  HStack,
  VStack,
  Box,
  Select,
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
import { CalendarIcon, InfoIcon } from '@chakra-ui/icons';

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

function EventsDetailsPage() {
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [isApprover, setIsApprover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const toast = useToast();

  const cardBgColor = useColorModeValue('white', 'gray.600');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventResponse, approverResponse] = await Promise.all([
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
        const approverData = await approverResponse.json();

        if (eventData[0] && eventData[0].position) {
          const uniquePositions = eventData[0].position.reduce((acc, current) => {
            const x = acc.find(item => item.position_name === current.position_name);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          eventData[0].position = uniquePositions;
        }

        setEventInfo(eventData[0]);
        setIsApprover(approverData.isApprover);
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

  const uniquePositions = useMemo(() => {
    if (!eventInfo || !eventInfo.position) return [];
    return [...new Set(eventInfo.position.map(pos => pos.position_name))];
  }, [eventInfo]);

  const positionColors = useMemo(() => {
    const colors = {};
    uniquePositions.forEach(pos => {
      colors[pos] = stringToColor(pos);
    });
    return colors;
  }, [uniquePositions]);

  const handleAssignRole = async (positionId, userId) => {
    if (!isApprover) {
      toast({
        title: "Unauthorized",
        description: "Only approvers can assign roles.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${requestServer}positions/${positionId}/assign`, {
        method: 'PUT',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast({
          title: "Role Assigned",
          description: "The role has been successfully assigned.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const updatedEventResponse = await fetch(`${requestServer}events/?id=${id}`, {
          method: "GET",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });
        const updatedEventData = await updatedEventResponse.json();
        setEventInfo(updatedEventData[0]);
      } else {
        throw new Error('Failed to assign role');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const togglePosition = (positionName) => {
    setSelectedPositions(prev => 
      prev.includes(positionName)
        ? prev.filter(p => p !== positionName)
        : [...prev, positionName]
    );
  };

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
              <Heading size="md">{eventInfo.name}</Heading>
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
                <Text><strong>Date:</strong> {formatDate(eventInfo.startDate)}</Text>
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
                  variant={selectedPositions.includes(pos) ? "solid" : "solid"}
                  backgroundColor={selectedPositions.includes(pos) ? positionColors[pos] : "solid"}
                  color={selectedPositions.includes(pos) ? "white" : positionColors[pos]}
                  borderColor={positionColors[pos]}
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
          {eventInfo && eventInfo.position && eventInfo.position
            .filter(pos => selectedPositions.length === 0 || selectedPositions.includes(pos.position_name))
            .map(pos => (
              <Box 
                key={pos.id} 
                bg={cardBgColor}
                p={4} 
                borderRadius="md"
                boxShadow="md"
                borderLeft="4px solid"
                borderLeftColor={positionColors[pos.position_name]}
              >
                <VStack align="stretch" spacing={3}>
                  <Flex justify="space-between" align="center">
                    <Heading size="sm">{pos.position_name}</Heading>
                    <Avatar size="sm" name={pos.victim} />
                  </Flex>
                  {isApprover ? (
                    <Select 
                      placeholder="Assign user" 
                      onChange={(e) => handleAssignRole(pos.id, e.target.value)}
                      value={pos.user_id || ''}
                      size="sm"
                    >
                      {eventInfo.users && eventInfo.users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </Select>
                  ) : (
                    <Text fontSize="sm">{pos.victim || 'Unassigned'}</Text>
                  )}
                  {pos.victim && (
                    <Tag size="sm" backgroundColor={positionColors[pos.position_name]} color="white">
                      <TagLabel>{pos.rank}</TagLabel>
                    </Tag>
                  )}
                </VStack>
              </Box>
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

export default EventsDetailsPage;