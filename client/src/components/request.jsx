import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Card
} from '@chakra-ui/react'
import { useDisclosure, Lorem, Select, Input } from '@chakra-ui/react'
const requestServer = 'http://localhost:8080/'

function RequestModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [type, setType] = useState("apt");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [desc, setDesc] = useState(null);

  let types = ['apt', 'other', 'something else']

  const submitFunction = async (e) => {
    e.preventDefault();
    onClose();
    console.log("Type: " + type + "\n")
    console.log("Start Date/Time: " + `${startDate}T${startTime}` +"\n")
    console.log("End Date: " + `${endDate}T${endTime}` +"\n")
    console.log("desc: " + desc + "\n")
    //T00:00
    try{
      await fetch(requestServer, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          start:`${startDate}T${startTime}`,
          end: `${endDate}T${endTime}`,
          desc: desc
        })
      })
    }
    catch(error){
      console.log(error)
    }
  }

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
              </Card>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={(e)=>submitFunction(e)} type='submit'>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestModal;