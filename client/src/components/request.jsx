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
  useToast,
} from '@chakra-ui/react'
import { useDisclosure, Select, Input } from '@chakra-ui/react'

const requestServer = 'http://localhost:8080/'
const approverServer = 'http://localhost:8080/users?approver=true'

function RequestModal() {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [desc, setDesc] = useState(null);
  const [approverList, setApproverList] = useState([]);
  const [approverID, setApproverID] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [submitted, setSubmitted] = useState(0);
  const toast = useToast();

  let types = ['Funeral', 'Retirement', 'Inauguration', 'Other']

  const submitFunction = async (e) => {
    e.preventDefault();
    console.log(`Title: ${title}`)
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
          title: "info",
          description: "start date is after end date",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      } else {
        try{
          console.log("inpost")
          let response = await fetch(`${requestServer}events`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: title,
              type: "Request",
              startTime: startTime,
              endTime: endTime,
              startDate: startDate,
              endDate: endDate,
              description: desc,
              approver: approverID,
              POCinfo: userInfo.name
            })
          })
          console.log(response.statusText)
          
          response.json()
            .then(json => {
              console.log(json.id+"    " + userInfo.id)
              fetch(`${requestServer}positions`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: "Request",
                users_id: userInfo.id,
                events_id: json.id,
              })}).then(res => res.json()).then(json => console.log(json))}
            )

          
          
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

  const fetchApprovers = () => {
    fetch(approverServer, fetchHeader)
      .then((res) => res.json())
      .then((data) => {
        console.log('fetchApprover data: ', data)
        setApproverList(data);
      })
  }

  const fetchUserInfo = async () => {
    let response = await fetch(`${requestServer}users/self`, {
      method: 'GET',
      credentials: "include",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      }
    })
    response.json().then(json=>setUserInfo(json[0]))
    
  }

  useEffect(() => {
    fetchApprovers();
    fetchUserInfo();
  }, []);

  useEffect(() => {
      setDesc(null)
      setEndTime(null)
      setStartTime(null)
      setEndDate(null)
      setStartDate(null)
      setApproverID(null)
  }, [submitted])

  if(approverList.length === 0) return <h1>loading</h1>

  return (
    <>
      <Button onClick={onOpen}>Unavail Request</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton style={{zIndex: '10'}}/>
          <ModalBody>
            <FormControl>
              <Card>
                <FormLabel>Title</FormLabel>
                <Input type="title" onChange={(e)=> setTitle(e.target.value)}/><br />
              </Card>
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