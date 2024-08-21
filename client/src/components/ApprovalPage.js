import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Heading, Text, CardFooter, SimpleGrid, CardHeader } from '@chakra-ui/react'

function ApprovalPage() {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }

  const [eventInfo, setEventInfo] = useState([]);

  const eventsServer = "http://localhost:8080/events"

  const fetchEvents = () => {
      fetch(eventsServer, fetchHeader)
      .then((res) => res.json())
      .then((data)=> {
        setEventInfo(data)
      })
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  if(!eventInfo){
    return "Loading"
  }
  return (
    <div>
    {eventInfo.map((event) => (
      <div key={event.id}>
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
          <Card>
            <CardHeader>
              <Heading size='md'> {event.name}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{event.description}</Text>
            </CardBody>
            <CardFooter>
              <Button>View Event</Button>
            </CardFooter>
          </Card>
          </SimpleGrid>
      </div>
      ))}
    </div>
    );
}

export default ApprovalPage;

