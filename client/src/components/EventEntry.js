import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Card,
  useToast,
  Grid,
  GridItem,
  InputGroup,
  activeLabelStyles,
  Textarea,
  Heading

} from '@chakra-ui/react'
import { useDisclosure, Select, Input } from '@chakra-ui/react'

const requestServer = 'http://localhost:8080/events'

function EventEntry() {
  const [type, setType] = useState("Retirement");
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [desc, setDesc] = useState(null);
  const [location, setLocation] = useState(null);
  const [poc, setPoc] = useState(null);
  const [submitted, setSubmitted] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  let types = ['Funeral', 'Retirement', 'Inauguration', 'Other']



  const submitFunction = async (e) => {
    e.preventDefault();

    console.log("Type: " + type + "\n")
    console.log("Start Date/Time: " + `${startDate}T${startTime}` +"\n")
    console.log("End Date/Time: " + `${endDate}T${endTime}` +"\n")
    console.log("desc: " + desc + "\n")
    if (!startDate || !startTime || !endDate || !endTime){
      toast({
        title: 'info.',
        description: "invalid entry",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } else {
      if (startDate > endDate){
        toast({
          title: 'info.',
          description: "start date is after end date",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      } else {
        try{
          let response = await fetch(requestServer, {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: title,
              type: type,
              startTime: startTime,
              endTime: endTime,
              startDate: startDate,
              endDate: endDate,
              description: desc,
              // poc: poc,
              // location: location
            })
          })
          console.log(response.statusText)
          toast({
            title: 'info.',
            description: response.statusText,
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
          setTimeout(() => {
            navigate(-1)
          }, "1000");
        }
        catch(error){
          console.log(error)
        }
        setSubmitted(submitted => submitted + 1);
      }
    }
  }

  useEffect(() => {
      setType("Retirement")
      setDesc(null)
      setEndTime(null)
      setStartTime(null)
      setEndDate(null)
      setStartDate(null)
  }, [submitted])

  return (
    <>
    <Heading size='md'>Event Entry</Heading>
    <Grid
      h='800px'
      templateColumns='repeat(8, 120px)'
      gap={4}
    >
      <GridItem
        colSpan={4}
        borderWidth='1px'
        borderColor='black'
        rounded='md'
        p="4"
        justifyContent="end"
        display="flex">
        <FormControl variant="floating" >
          <InputGroup justifyContent="end"
          display="flex">
            <FormLabel fontSize="25px">Title</FormLabel>
            <Input type="text" onChange={(e)=> setTitle(e.target.value)} width="50%"/>
          </InputGroup>
          <InputGroup justifyContent="end"
            display="flex">
                <FormLabel fontSize="25px">Start Date</FormLabel>
                <Input type="date" onChange={(e)=> setStartDate(e.target.value)} width="50%"/><br />
          </InputGroup >
          <InputGroup justifyContent="end"
            display="flex">
                <FormLabel fontSize="25px">Start Time</FormLabel>
                <Input type="time" onChange={(e)=> setStartTime(e.target.value)} width="50%"/><br />
          </InputGroup>
                <InputGroup justifyContent="end"
            display="flex">
                <FormLabel fontSize="25px">End Date</FormLabel>
                <Input type="date" onChange={(e)=> setEndDate(e.target.value)} width="50%"/><br />
                </InputGroup>
          <InputGroup justifyContent="end"
            display="flex">
                <FormLabel fontSize="25px">End time</FormLabel>
                <Input type="time" onChange={(e)=> setEndTime(e.target.value)} width="50%"/><br />
          </InputGroup>
          <InputGroup justifyContent="end"
            display="flex">
                <FormLabel fontSize="25px">Description</FormLabel>
                <Textarea onChange={(e)=> setDesc(e.target.value)} width="50%"/><br />
          </InputGroup>
          <InputGroup justifyContent="end"
            display="flex">
                <FormLabel fontSize="25px">POC Information</FormLabel>
                <Input type='text' onChange={(e)=> setPoc(e.target.value)} width="50%"/><br />
          </InputGroup>
          <InputGroup justifyContent="end"
            display="flex">
                <FormLabel fontSize="25px">Location</FormLabel>
                <Input type='text' onChange={(e)=> setLocation(e.target.value)} width="50%"/>
          </InputGroup><br/>

          <InputGroup justifyContent="center"
            display="flex">
          <Button bg='tomato' mr={3} onClick={() => navigate(-1)} type='submit'>
              Cancel
            </Button>
          <Button colorScheme='blue' mr={3} onClick={(e)=>submitFunction(e)} type='submit'>
            Submit
          </Button>
          </InputGroup>
        </FormControl>
          </GridItem>

          <GridItem colSpan={2}   borderWidth='1px'
            borderColor='black'
            rounded='md'
            p="4">
              Required Positions
            </GridItem>
            <GridItem colSpan={2}   borderWidth='1px'
            borderColor='black'
            rounded='md'
            p="4">

            </GridItem>


    </Grid>
    </>
  )
}

export default EventEntry;