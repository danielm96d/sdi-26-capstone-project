import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Heading, Text, CardFooter, SimpleGrid, CardHeader, Badge } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import './Approval.css'
import {useNavigate} from 'react-router-dom';

function ApprovalPage() {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }

  const [eventInfo, setEventInfo] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const navigate = useNavigate()
  const eventsServer = "http://localhost:8080/events"

  const fetchEvents = () => {
    fetch('http://localhost:8080/users/self', fetchHeader)
      .then(res=>res.json())
      .then(data=>{
        setCurrentUser(data)
        return data
      })
      .then(userinfo=>{
        fetch(eventsServer, fetchHeader)
          .then((res) => res.json())
          .then((data)=> {
            data.filter(event=>{
              console.log('event: ', event, '\nuser: ', userinfo.id)
              return event.approver.id === userinfo.id
            })
            setEventInfo(data)
          })
      })
  }

  const viewEventHandler = (id, obj) => {
    navigate(`/middleware/${id}`, obj)
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  if(!eventInfo){
    return "Loading"
  }
  return (
    <Tabs isFitted varient='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab>Show All</Tab>
          <Tab>Approved</Tab>
          <Tab>Event Approval</Tab>
          <Tab>Request Approval</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
          <div className='approvalContainer'>
            {eventInfo.map((event) => (
            <div key={event.id}>
              <SimpleGrid
                spacing={4}
              >
                <Card style={{
                  margin: '10px',
                  width: '300px',
                  height: '300px'
                }}>
                  <CardHeader>
                    <Heading size='md'> {event.name}</Heading>
                    <Text>Time: {event.startTime} - {event.endTime}</Text>
                    {event.approved ? (
                      <Badge colorScheme="green">Scheduled</Badge>
                    ) : (
                      <Badge colorScheme="red">Needs Approval</Badge>
                    )}
                  </CardHeader>
                  <CardBody>
                    <Text>Event: {event.type}</Text>
                  </CardBody>
                  <CardFooter>
                    <Button onClick={()=> viewEventHandler(event.id, {state:{isRequest: event.type === 'Request'}})}>View Event</Button>
                  </CardFooter>
                </Card>
                </SimpleGrid>
            </div>
            ))}
          </div>
          </TabPanel>
          <TabPanel>
            <div className='approvalContainer'>
              {eventInfo.filter((event) => {
                return event.approved
              }).map((event) => (
              <div key={event.id}>
                <SimpleGrid
                  spacing={4}
                >
                  <Card style={{
                    margin: '10px',
                    width: '300px',
                    height: '300px'
                  }}>
                    <CardHeader>
                      <Heading size='md'> {event.name}</Heading>
                      <Text>Time: {event.startTime} - {event.endTime}</Text>
                      {event.approved ? (
                        <Badge colorScheme="green">Scheduled</Badge>
                      ) : (
                        <Badge colorScheme="red">Needs Scheduling</Badge>
                      )}
                    </CardHeader>
                    <CardBody>
                      <Text>Event: {event.type}</Text>
                    </CardBody>
                    <CardFooter>
                      <Button onClick={()=> viewEventHandler(event.id)}>View Event</Button>
                    </CardFooter>
                  </Card>
                  </SimpleGrid>
              </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className='approvalContainer'>
              {eventInfo.filter((event) => {
                return !event.approved
              }).map((event) => (
                <div key={event.id}>
                  <SimpleGrid
                    spacing={4}
                  >
                    <Card style={{
                      margin: '10px',
                      width: '300px',
                      height: '300px'
                    }}>
                      <CardHeader>
                        <Heading size='md'> {event.name}</Heading>
                        <Text>Time: {event.startTime} - {event.endTime}</Text>
                        {event.approved ? (
                          <Badge colorScheme="green">Scheduled</Badge>
                        ) : (
                          <Badge colorScheme="red">Needs Scheduling</Badge>
                        )}
                      </CardHeader>
                      <CardBody>
                        <Text>Event: {event.type}</Text>
                      </CardBody>
                      <CardFooter>
                        <Button onClick={()=> viewEventHandler(event.id)}>View Event</Button>
                      </CardFooter>
                    </Card>
                    </SimpleGrid>
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel>

          </TabPanel>
        </TabPanels>
    </Tabs>
    );
}

export default ApprovalPage;

