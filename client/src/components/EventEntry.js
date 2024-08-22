import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  Button,
  FormControl,
  FormLabel,
  useToast,
  Grid,
  GridItem,
  InputGroup,
  Textarea,
  Heading,
  Center,
  Divider,
  Stack,
  useColorModeValue,
  Card,
  Select

} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Helmet } from 'react-helmet';

const requestServer = 'http://localhost:8080/'
const approverServer = 'http://localhost:8080/users?approver=true'

const colors = {
  'Pallbearer': 'Salmon',
  'Bearer': 'Olive',
  'OIC': 'LightSkyBlue',
  'NCOIC': 'LightGreen',
  'Firing Party': 'Gray',
  'Drill': 'Tomato',
  'Color Guard': 'Lavender',
  'Flag Holder': 'Silver',
  'Escort': 'Fuchsia',
  'Bugler': 'Gold'
}

function EventEntry() {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }
  const borderColor = useColorModeValue('black', 'gray')
  const [type, setType] = useState("Retirement");
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [desc, setDesc] = useState(null);
  const [location, setLocation] = useState(null);
  const [poc, setPoc] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [submitted, setSubmitted] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const positions = ["Bearer", "Firing Party", "Drill", "Color Guard", 'Bugler', 'Escort', 'Pallbearer', 'Flag Holder', 'OIC', 'NCOIC'];
  const [approverList, setApproverList] = useState([]);
  const [approverID, setApproverID] = useState(null);




  const submitFunction = async (e) => {
    e.preventDefault();

    console.log("Type: " + type + "\n")
    console.log("Start Date/Time: " + `${startDate}T${startTime}` + "\n")
    console.log("End Date/Time: " + `${endDate}T${endTime}` + "\n")
    console.log("desc: " + desc + "\n")
    if (!startDate || !startTime || !endDate || !endTime) {
      toast({
        title: 'info.',
        description: "invalid entry",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } else {
      if (startDate > endDate) {
        toast({
          title: 'info.',
          description: "start date is after end date",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      } else {
        try {
          let response = await fetch(`${requestServer}events`, {
            method: 'POST',

            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: title,
              startTime: startTime,
              endTime: endTime,
              startDate: startDate,
              endDate: endDate,
              description: desc,
              POCinfo: poc,
              location: location,
              approver: approverID
            })
          })
          response.json()
            .then(res => {
              console.log(res)
              selectedPositions.map((pos) => {
                fetch(`${requestServer}positions`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: pos,
                    events_id: res.id
                  })
                })
                  .then(res => res.json())
                  .then(res => console.log(res))
              })
            })

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
        catch (error) {
          console.log(error)
        }
        setSubmitted(submitted => submitted + 1);
      }
    }
  }

  const fetchApprovers = () => {
    fetch(approverServer, fetchHeader)
      .then((res) => res.json())
      .then((data) => {
        console.log('fetchApprover data: ', data)
        setApproverList(data);
      })
  }

  const handleClick = (pos) => {
    setSelectedPositions(selectedPositions => [...selectedPositions, pos])
  }

  const handleDelete = (pos) => {
    setSelectedPositions((prevPositions) => {
      const index = prevPositions.indexOf(pos);
      if (index > -1) {
        // Create a new array with the item removed
        return [...prevPositions.slice(0, index), ...prevPositions.slice(index + 1)];
      }
      return prevPositions; // Return the original array if item is not found
    });

  }

  useEffect(() => {
    setType("Retirement")
    setDesc(null)
    setEndTime(null)
    setStartTime(null)
    setEndDate(null)
    setStartDate(null)
    fetchApprovers();
  }, [submitted])

  if(approverList.length === 0) return <h1>loading</h1>

  return (
    <>
      <Helmet>
        <title>OpSync | New Event</title>
      </Helmet>
      <Heading size='md'>Event Entry</Heading>
      <Grid
        h='800px'
        templateColumns='repeat(8, 120px)'
        gap={4}
      >
        <GridItem
          colSpan={4}
          borderWidth='1px'
          borderColor={borderColor}
          rounded='md'
          p="4"
          justifyContent="end"
          display="flex">
          <FormControl variant="floating" >
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">Title</FormLabel>
              <Input type="text" onChange={(e) => setTitle(e.target.value)} width="50%" />
            </InputGroup>
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">Start Date</FormLabel>
              <Input type="date" onChange={(e) => setStartDate(e.target.value)} width="50%" /><br />
            </InputGroup >
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">Start Time</FormLabel>
              <Input type="time" onChange={(e) => setStartTime(e.target.value)} width="50%" /><br />
            </InputGroup>
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">End Date</FormLabel>
              <Input type="date" onChange={(e) => setEndDate(e.target.value)} width="50%" /><br />
            </InputGroup>
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">End time</FormLabel>
              <Input type="time" onChange={(e) => setEndTime(e.target.value)} width="50%" /><br />
            </InputGroup>
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">Description</FormLabel>
              <Textarea onChange={(e) => setDesc(e.target.value)} width="50%" /><br />
            </InputGroup>
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">POC Information</FormLabel>
              <Input type='text' onChange={(e) => setPoc(e.target.value)} width="50%" /><br />
            </InputGroup>
            <InputGroup justifyContent="end"
              display="flex">
              <FormLabel fontSize="25px">Location</FormLabel>
              <Input type='text' onChange={(e) => setLocation(e.target.value)} width="50%" />
            </InputGroup><br />
            <Card>
                <FormLabel>Select Approver</FormLabel>
                <Select placeholder='Select Approver' onChange={(e) =>
                  {
                    console.log('value: ',e.target.value)
                    setApproverID(e.target.value)
                  }
                }>
                  {approverList.map(approver => {
                    console.log(approver)
                  return <option key={approver.id} value={approver.id}>
                    {approver.name}
                  </option>
                  })}
                </Select>
              </Card>
            <InputGroup justifyContent="center"
              display="flex">
              <Button bg='tomato' mr={3} onClick={() => navigate(-1)} type='submit'>
                Cancel
              </Button>
              <Button colorScheme='blue' mr={3} onClick={(e) => submitFunction(e)} type='submit'>
                Submit
              </Button>
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem textAlign="center" colSpan={2} borderWidth='1px'
          borderColor={borderColor}
          rounded='md'
          p="4">
          <Heading size="lg">Available</Heading>
          <Divider marginY="1em" />
          <Stack direction="row" flexWrap="wrap">
            {positions.map((pos) =>
              <>
                <Center>
                  <Button bg={colors[pos]} onClick={() => handleClick(pos)}>{pos}</Button><br />
                </Center>
              </>
            )}
          </Stack>
        </GridItem>
        <GridItem textAlign="center" colSpan={2} borderWidth='1px'
          borderColor={borderColor}
          rounded='md'
          p="4">
          <Heading size="lg">Selected</Heading>
          <Divider marginY="1em" />
          <Stack direction="row" flexWrap="wrap">
            {selectedPositions.map((pos, index) =>
              <>
                <Center>
                  <Button key={index} bg={colors[pos]} onClick={() => handleDelete(pos)}>{pos}</Button>
                </Center>
              </>
            )}

          </Stack>

        </GridItem>


      </Grid>
    </>
  )
}

export default EventEntry;