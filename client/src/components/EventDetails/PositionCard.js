import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Flex,
  Heading,
  Avatar,
  Select,
  Text,
  Tag,
  TagLabel,
  Button,
  useColorModeValue,
  Collapse,
  useDisclosure,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { EditIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const requestServer = 'http://localhost:8080/';

function PositionCard({ 
  positions, 
  currentUser, 
  isApprover, 
  eventUsers, 
  positionColors, 
  eventId,
  eventStartDate,
  eventEndDate,
  eventStartTime,
  eventEndTime,
  onUpdateEvent
}) {
  console.log('PositionCard props:', { positions, currentUser, isApprover, eventUsers, positionColors, eventId, eventStartDate, eventEndDate, eventStartTime, eventEndTime });

  const cardBgColor = useColorModeValue('white', 'gray.600');
  const [editRequests, setEditRequests] = useState([]);
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const toast = useToast();
  const [editedTimes, setEditedTimes] = useState({
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
  });
  
  const startDate = positions.startDate || eventStartDate;
  const endDate = positions.endDate || eventEndDate;
  const startTime = positions.startTime || eventStartTime;
  const endTime = positions.endTime || eventEndTime;

  // Function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    if (isApprover) {
      fetchEditRequests();
    }
  }, [isApprover, positions.id, eventId]);

  const fetchEditRequests = async () => {
    try {
      const response = await fetch(`${requestServer}events/?id=${eventId}`, {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const eventData = await response.json();
        const positionEditRequests = eventData[0].positions.find(pos => pos.id === positions.id)?.editRequests || [];
        setEditRequests(positionEditRequests);
      }
    } catch (error) {
      console.error('Error fetching edit requests:', error);
    }
  };

  const handleApproveEditRequest = async (requestId) => {
    try {
      const response = await fetch(`${requestServer}events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positions: [{
            id: positions.id,
            editRequests: [{
              id: requestId,
              status: 'approved'
            }]
          }]
        }),
      });
      if (response.ok) {
        toast({
          title: "Edit Request Approved",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchEditRequests();
        const updatedEventData = await response.json();
        onUpdateEvent(updatedEventData);
      }
    } catch (error) {
      console.error('Error approving edit request:', error);
      toast({
        title: "Error",
        description: "Failed to approve edit request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDenyEditRequest = async (requestId) => {
    try {
      const response = await fetch(`${requestServer}events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positions: [{
            id: positions.id,
            editRequests: [{
              id: requestId,
              status: 'denied'
            }]
          }]
        }),
      });
      if (response.ok) {
        toast({
          title: "Edit Request Denied",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchEditRequests();
        const updatedEventData = await response.json();
        onUpdateEvent(updatedEventData);
      }
    } catch (error) {
      console.error('Error denying edit request:', error);
      toast({
        title: "Error",
        description: "Failed to deny edit request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updatedPosition = {
        id: positions.id,
        startTime: editedTimes.startTime,
        endTime: editedTimes.endTime,
        startDate: editedTimes.startDate,
        endDate: editedTimes.endDate,
      };
  
      const response = await fetch(`${requestServer}events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positions: [updatedPosition],
          approved: false,
        }),
      });
  
      if (response.ok) {
        toast({
          title: "Time Change Request Submitted",
          description: "Your time change request has been submitted. The event is now pending approval.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onEditModalClose();
        
        const updatedEventData = await response.json();
        onUpdateEvent(updatedEventData);
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to update event: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error in handleEditSubmit:', error);
      toast({
        title: "Error",
        description: `Failed to submit time change request: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTimes(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = () => {
    setEditedTimes({
      startTime: positions.startTime || eventStartTime,
      endTime: positions.endTime || eventEndTime,
      startDate: positions.startDate || eventStartDate,
      endDate: positions.endDate || eventEndDate,
    });
    onEditModalOpen();
  };
  const canEditPosition = () => {
    return currentUser && currentUser.id === positions.user_id;
  };

  const handleAssignRole = async (userId) => {
    try {
      const response = await fetch(`${requestServer}events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positions: [{
            id: positions.id,
            users_id: userId
          }]
        }),
      });
      if (response.ok) {
        toast({
          title: "Role Assigned",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const updatedEventData = await response.json();
        onUpdateEvent(updatedEventData);
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      bg={cardBgColor}
      p={4} 
      borderRadius="md"
      boxShadow="md"
      borderLeft="4px solid"
      borderLeftColor={positionColors[positions.positionName]}
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="center">
          <Heading size="sm">{positions.positionName}</Heading>
          <Avatar size="sm" name={positions.victim} />
        </Flex>
        {positions.victim ? (
          <Text fontSize="sm">{positions.victim}</Text>
        ) : (
          <Select 
            placeholder="Assign user" 
            onChange={(e) => handleAssignRole(e.target.value)}
          >
            {eventUsers && eventUsers.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </Select>
        )}
        {positions.victim && (
          <Tag size="sm" colorScheme={positionColors[positions.positionName]}>
            <TagLabel>{positions.rank}</TagLabel>
          </Tag>
        )}
        <Text fontSize="sm">Date: {formatDate(startDate)}{startDate !== endDate ? ` - ${formatDate(endDate)}` : ''}</Text>
        <Text fontSize="sm">Time: {startTime} - {endTime}</Text>
        {canEditPosition() && (
          <Button leftIcon={<EditIcon />} size="sm" onClick={openEditModal}>
            Edit Times
          </Button>
        )}
        {isApprover && editRequests.length > 0 && (
          <VStack align="stretch" spacing={2}>
            <Button 
              rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} 
              onClick={onToggle} 
              size="sm"
            >
              {console.log('Rendering PositionCard:', positions)}
              View Edit Requests ({editRequests.length})
            </Button>
            <Collapse in={isOpen}>
              <VStack align="stretch" spacing={2}>
                {editRequests.map((request) => (
                  <Box key={request.id} p={2} borderWidth={1} borderRadius="md">
                    <Text fontSize="sm">Requested by: {request.userName}</Text>
                    <Text fontSize="sm">New Date: {formatDate(request.newStartDate)}{request.newStartDate !== request.newEndDate ? ` - ${formatDate(request.newEndDate)}` : ''}</Text>
                    <Text fontSize="sm">New Time: {request.newStartTime} - {request.newEndTime}</Text>
                    <HStack mt={2}>
                      <Button size="xs" colorScheme="green" onClick={() => handleApproveEditRequest(request.id)}>
                        Approve
                      </Button>
                      <Button size="xs" colorScheme="red" onClick={() => handleDenyEditRequest(request.id)}>
                        Deny
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Collapse>
          </VStack>
        )}
      </VStack>

      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Position Times</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  value={editedTimes.startDate}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  value={editedTimes.endDate}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  name="startTime"
                  value={editedTimes.startTime}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="time"
                  name="endTime"
                  value={editedTimes.endTime}
                  onChange={handleInputChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>
              Submit Time Change Request
            </Button>
            <Button variant="ghost" onClick={onEditModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default PositionCard;