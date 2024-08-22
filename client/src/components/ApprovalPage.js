import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Heading, Text, CardFooter, SimpleGrid, CardHeader, Badge } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import './Approval.css'
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

function ApprovalPage() {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }

  const [eventInfo, setEventInfo] = useState([]);
  const navigate = useNavigate()
  const eventsServer = "http://localhost:8080/events"

  const fetchEvents = () => {
    fetch('http://localhost:8080/users/self', fetchHeader)
      .then(res => res.json())
      .then(data => {
        console.log('eventInfo: ', data[0].overseenEvents)
        console.log('userData: ', data)
        setEventInfo(data[0].overseenEvents)
      })
  }

  const viewEventHandler = (id, obj) => {
    navigate(`/middleware/${id}`, obj)
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  if (!eventInfo) {
    return "Loading"
  }
  return (
    <Tabs isFitted varient='soft-rounded' colorScheme='green'>
      <Helmet>
        <title>OpSync | Approval</title>
      </Helmet>
      <TabList>
        <Tab>Show All</Tab>
        <Tab>Approved</Tab>
        <Tab>Event Approval</Tab>
        <Tab>Request Approval</Tab>
      </TabList>

      {/* Show all Tab */}
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
                      <Button onClick={() => viewEventHandler(event.id, { state: { isRequest: event.type === 'Request' } })}>View Event</Button>
                    </CardFooter>
                  </Card>
                </SimpleGrid>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Show all Approved */}
        <TabPanel>
          <div className='approvalContainer'>
            {eventInfo.filter((event) => {
              console.log(event)
              return event.approved === true;
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
                      <Button onClick={() => viewEventHandler(event.id, { state: { isRequest: event.type === 'Request' } })}>View Event</Button>
                    </CardFooter>
                  </Card>
                </SimpleGrid>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Show all unapproved Events */}
        <TabPanel>
          <div className='approvalContainer'>
            {eventInfo.filter((event) => {
              return (!event.approved && event.type !== "Request")
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
                      <Button onClick={() => viewEventHandler(event.id, { state: { isRequest: event.type === 'Request' } })}>View Event</Button>
                    </CardFooter>
                  </Card>
                </SimpleGrid>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Show all unapproved Requests */}
        <TabPanel>
          <div className='approvalContainer'>
            {eventInfo.filter((event) => {
              return (!event.approved && event.type === "Request") ? true : false
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
                      <Button onClick={() => viewEventHandler(event.id, { state: { isRequest: event.type === 'Request' } })}>View Event</Button>
                    </CardFooter>
                  </Card>
                </SimpleGrid>
              </div>
            ))}
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default ApprovalPage;

