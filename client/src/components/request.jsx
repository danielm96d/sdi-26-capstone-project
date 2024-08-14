import React, { useState, useEffect } from 'react';
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
  useToast
} from '@chakra-ui/react'
import { useDisclosure, Select, Input } from '@chakra-ui/react'

const requestServer = 'http://localhost:8080/events'

function RequestModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [type, setType] = useState("Retirement");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [desc, setDesc] = useState(null);
  const [submitted, setSubmitted] = useState(0);
  const toast = useToast();

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
              name: type,
              type: type,
              startTime: startTime,
              endTime: endTime,
              startDate: startDate,
              endDate: endDate,
              description: desc,
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
        }
        catch(error){
          console.log(error)
        }
        setSubmitted(submitted => submitted + 1);
        onClose();
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
      <Button onClick={onOpen}>Unavail Request</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select onChange={(e)=> setType(e.target.value)}>
                {types.map(x => (
                  <option value={x}>{x}</option>
                ))
                }
              </Select><br />
              <Card>
                <FormLabel>Start Date</FormLabel>
                <Input type="date" onChange={(e)=> setStartDate(e.target.value)}/><br />
                <FormLabel>Start Time</FormLabel>
                <Input type="time" onChange={(e)=> setStartTime(e.target.value)}/><br />
              </Card>
              <Card>
                <FormLabel>End Date</FormLabel>
                <Input type="date" onChange={(e)=> setEndDate(e.target.value)}/><br />
                <FormLabel>End time</FormLabel>
                <Input type="time" onChange={(e)=> setEndTime(e.target.value)}/><br />
              </Card>
              <Card>
                <FormLabel>Description</FormLabel>
                <Input type='text' onChange={(e)=> setDesc(e.target.value)}/>
              </Card><br/ >
                <Button colorScheme='blue' mr={3} onClick={(e)=>submitFunction(e)} type='submit'>
                Submit
              </Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestModal;