import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {
  Button,
  Heading,
  Spacer,
  Grid,
  GridItem,
  Wrap,
  Card,
  CardHeader,
  Text,
  CardBody,
  useToast

} from '@chakra-ui/react'

const requestServer = 'http://localhost:8080/'


function ApprovalDetailsPage () {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState({});
  const [conflicts, setConflicts] = useState([])
  const [usersEvents, setUsersEvents] = useState([])
  const navigate = useNavigate();
  const toast = useToast();

  const dateTimeString = (date, time) => {
    return `${date.slice(0, date.indexOf('T'))}T${time.slice(0, 5)}`
  }

  const getPotentialConflicts = async (filteredEvents) => {
    setUsersEvents([]);
    filteredEvents.map((event) => {
      fetchEventDetails(`${requestServer}events/?id=${event.events_id}`);
    })
  }

  const fetchEventDetails = async (url) => {
      fetch(url, fetchHeader)
        .then (res => res.json())
        .then (res => setUsersEvents(usersEvents => [...usersEvents, res[0]]))
  }

  const eventInfoFetch = async () => {
    try{
      const response = await fetch(`${requestServer}events/?id=${id}`,fetchHeader);
      const data = await response.json()
      setEventInfo(data[0]);
      const responseUserData = await fetch(`${requestServer}users?id=${data[0].position[0].user_id}`,fetchHeader);
      const userData = await responseUserData.json();

      let filteredEvents = userData[0].positions.filter((event) => event.events_id != id)
      getPotentialConflicts(filteredEvents)

    } catch (error){
      console.log(error)
    }
  }

    const setApprove = async () => {
      const response = await fetch(`${requestServer}events/${id}`,{
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved: true
        })
      });
      toast({
        title: 'info',
        description: "Event Approved",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setTimeout(() => {
        console.log("Delayed for 1 second.");
        navigate(-2);
      }, 1000);
    }

    const setDisapprove = async () => {
      const response = await fetch(`${requestServer}events/${id}`,{
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved: false
        })
      });
      toast({
        title: 'info',
        description: "Event Disapproved",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setTimeout(() => {
        console.log("Delayed for 1 second.");
        navigate(-2);
      }, 1000);
    }


  useEffect(()=>{
    //compare times and place conflicts on table
    if (usersEvents.length > 0 && Object.keys(eventInfo).length !== 0){
      let oStart = dateTimeString(eventInfo.startDate, eventInfo.startTime);
      let oEnd = dateTimeString(eventInfo.endDate, eventInfo.endTime);

      let filteredEvents = usersEvents.filter((event) => {
        let start = dateTimeString(event.startDate, event.startTime);
        let end = dateTimeString(event.endDate, event.endTime);
        if ((oStart <= start && oEnd <= end && start <= oEnd)||(oStart >= start && oEnd >= end && end >= oStart)||(oStart <= start && oEnd >= end) ||(oStart >= start && oEnd <= end)){
          return true;
        } else {
          return false;
        }
      })

      setConflicts(filteredEvents)
    }

  }, [usersEvents])


  useEffect(()=>{
    eventInfoFetch()
    // userFetch()
  },[])

  return(
    <div>
      {Object.keys(eventInfo).length !== 0  ? (
        <Grid
          templateColumns='repeat(8, 1fr)'
          templateRows='50px, 30px, 50px'
          gap={4}
          padding='5px'>
          <GridItem  borderWidth='1px'
            rounded='md'
            display='flex' colSpan={8} rowSpan={1} p="5px" paddingY="1em">
              <Heading>{eventInfo.name}</Heading> 
              <Spacer />
              <Button bg='lightgreen' onClick={() => setApprove()}>Approve</Button>
            <Button bg='tomato' onClick={() => setDisapprove()}>Dis-Approve</Button>
            <Button onClick={() => navigate(-2)}>Back</Button>
          </GridItem>
          <GridItem  borderWidth='1px'
            rounded='md'
            display='flex' colSpan={8} rowSpan={1} p="5px" paddingY="1em">
            <Heading size='sm'>POC: {eventInfo.POCinfo}</Heading>
              <Spacer />
            <Heading size='sm'>Start: {dateTimeString(eventInfo.startDate, eventInfo.startTime)} End: {dateTimeString(eventInfo.endDate, eventInfo.endTime)}</Heading>
          </GridItem>
          <GridItem  borderWidth='1px'
            rounded='md'
            display='flex' colSpan={3} rowSpan={2} p="5px" paddingY="1em"
                  > <br/><br/>
                  {eventInfo.description}
                  <br /></GridItem>
          <GridItem  borderWidth='1px'
            rounded='md'
            display='flex' colSpan={5} rowSpan={1} p="5px" paddingY="1em" justifyContent="center"
                  > 
            <Heading>Conflicts</Heading></GridItem>
        
                      <GridItem  borderWidth='1px'
            rounded='md'colSpan={5} p="5px" paddingY="1em"
            display='flex' ><Wrap>
                      {conflicts.length > 0 ? (conflicts.map((conflict) => {
                        return (
                        <div key={conflict.id}>
                          {/* {`${conflict.name} : Start: ${dateTimeString(conflict.startDate, conflict.startTime)} End: ${dateTimeString(conflict.endDate, conflict.endTime)}`} */}
                        
                     
                    <Card style={{
                      margin: '10px',
                      width: '300px',
                      height: '100px'
                    }}>
                      <CardHeader>
                        <Heading size='md'> {conflict.name}</Heading>
                        <Text>Start: {dateTimeString(conflict.startDate, conflict.startTime)}
                          <br/>
                          End: {dateTimeString(conflict.endDate, conflict.endTime)}
                        </Text>

                      </CardHeader>
                      <CardBody>
                 
                      </CardBody>
                    </Card>
                 
                    </div>
                        )
                      })) : "\n No conflicts"}
                      </Wrap>
                      </GridItem>
                     
                      
                     
                    
                    </Grid>
                  ) : null}
    </div>
  )
}


export default ApprovalDetailsPage