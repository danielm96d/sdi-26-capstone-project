import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import {
  Grid,
  GridItem,
  Button,
  Heading,
  Spacer,
  List,
  Box,
  Stack,
  useColorModeValue,
  Divider,
  useToast
} from '@chakra-ui/react'

const requestServer = 'http://localhost:8080/'

const colors = {
  'Pallbearer': 'Salmon',
  'Bearer': 'Olive',
  'OIC': 'LightSkyBlue',
  'NCOIC':'LightGreen',
  'Firing Party': 'Gray',
  'Drill': 'HotPink',
  'Color Guard': 'Lavender',
  'Flag Holder': 'Silver',
  'Escort': 'Fuchsia',
  'Bugler': 'Gold',
  'true': 'tomato'
}



export default function Scheduler () {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [positionsInfo, setPositionsInfo] = useState([]);
  const navigate = useNavigate();
  const[bodies, setBodies] = useState([]);
  const [eventBodiesTotal, setEventBodiesTotal] = useState([]);
  const[users, setUsers] =useState([])
  const[positionId, setPositionId] =useState([])
  const borderColor = useColorModeValue('black', 'gray')
  const toast = useToast();

  const dateTimeString = (date, time) => {
    return `${date.slice(0, date.indexOf('T'))}T${time.slice(0, 5)}`
  }

  const eventInfoFetch = async () => {
    try{
      const response = await fetch(`${requestServer}events?id=${id}`, fetchHeader);
      const data = await response.json();
      if (data.length > 0){
        setEventInfo(data);
        const posArr = [];
        setEventBodiesTotal(data[0].position)
        data[0].position.map((position) => {
          let index = posArr.map(e => e.name).indexOf(position.position_name)
          if(index !== -1){
            posArr[index].quantity = posArr[index].quantity + 1;
          } else {
            let positionObj = {name:position.position_name, quantity: 1 }
            posArr.push(positionObj)
          }
        })
        setPositionsInfo(posArr);
      }
    } catch (error){
      console.log(error)
    }
  }

  const positionsInfoPatch = async () => {
    eventBodiesTotal.map((position) => {
        fetch(`${requestServer}positions/${position.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: position.id,
            name: position.position_name,
            users_id: position.user_id,
            events_id: position.events_id,
          })})
        .then(res=>res.json())
        .catch(err=>console.log(err))
    })
  }

  const eventInfoDelete = async () => {
    try{
      const response = await fetch(`${requestServer}events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })})
    } catch (error){
      console.log(error)
    }
    try{
      const response = await fetch(`${requestServer}positions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })})

    } catch (error){
      console.log(error)
    }
    navigate(-2)
  }

  const showRequiredBodies = async (posName) => {
    let filteredBodies = eventBodiesTotal.filter((position) => position.position_name === posName);
    setBodies(filteredBodies);

    try {
        const userResponse = await fetch(`${requestServer}users/`, fetchHeader);
        const userData = await userResponse.json();

        // Process user availability
        const processedUsers = await Promise.all(userData.map(async (user) => {
            let busy = false;
            const userEventsResponse = await fetch(`${requestServer}users/?id=${user.id}`, fetchHeader);
            const userEventsData = await userEventsResponse.json();
            let oStart = dateTimeString(eventInfo[0].startDate, eventInfo[0].startTime);
            let oEnd = dateTimeString(eventInfo[0].endDate, eventInfo[0].endTime);

            userEventsData[0].events.forEach((event) => {
                if (event.id !== eventInfo[0].id) {
                    let start = dateTimeString(event.startDate, event.startTime);
                    let end = dateTimeString(event.endDate, event.endTime);
                    if ((oStart <= start && oEnd <= end && start <= oEnd) ||
                        (oStart >= start && oEnd >= end && end >= oStart) ||
                        (oStart <= start && oEnd >= end) ||
                        (oStart >= start && oEnd <= end)) {
                        busy = true;
                    }
                }
            });

            return { ...user, busy };
        }));

        setUsers([...processedUsers, { name: "clear user", busy: true }]);
    } catch (error) {
        console.log(error);
    }
};

  const handleBodyClicked = (newValue, newName) => {
    console.log(newValue, newName)
    const updatedItems = eventBodiesTotal.map((item) =>{
      if (newValue === "clear user"){
        return item.id === positionId ? { ...item, user_id: null, victim: null } : item
      } else{
        return item.id === positionId ? { ...item, user_id: newValue, victim: newName} : item
      }
    });

    const updatedItemsForBodies = bodies.map((item) =>{
      if (newValue === "clear user"){
        return item.id=== positionId ? { ...item, user_id: null, victim: null  } : item
      } else{
        return item.id=== positionId ? { ...item, user_id: newValue, victim: newName} : item
      }
    });
      setBodies(updatedItemsForBodies);
      setEventBodiesTotal(updatedItems);
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

  useEffect(() => {
    eventInfoFetch()
  }, [])

  return (
    <Box>
      {eventInfo ? (
        <>
          <Grid
            templateColumns='repeat(8, minmax(120px, 1fr))'
            templateRows='50px, 30px, 50px, 700px'
            gap={4}
            padding='5px'
          >
            <GridItem  borderWidth='1px'
              borderColor={borderColor}
              rounded='md'
              display='flex' colSpan={8} rowSpan={1} p="5px" paddingY="1em">
                <Heading as='h2' size='xl'>{eventInfo[0].name}</Heading>
                <Spacer />
                <Button bg='darkolivegreen' onClick={() => positionsInfoPatch()}>Save</Button>
                <Button onClick={() => navigate(-2)}>Back</Button>
                <Button bg='tomato' onClick={() => eventInfoDelete()}>Delete</Button>
                <Button bg='lightgreen' onClick={() => setApprove()}>Approve</Button>
            </GridItem>

            <GridItem colSpan={8} rowSpan={1}  borderWidth='1px'
              borderColor={borderColor}
              rounded='md' display="flex" h="30px" p="5px">
              <Heading as='h4' size='l'>{`POC: ${eventInfo[0].POCinfo}  Location: ${eventInfo[0].location}`}</Heading>
            </GridItem>

            <GridItem colSpan={8} rowSpan={1}  borderWidth='1px'
              borderColor={borderColor}
              rounded='md' display="flex" h="50px" p="5px">
                {positionsInfo.length > 0 ? (
                <>
                  {positionsInfo.map((pos, index) => (
                    <Box key={index}>
                    <Button mr='10px' bg={colors[pos.name]} onClick={() => showRequiredBodies(pos.name)} >{pos.name}</Button>
                    </Box>
                  ))}
                </>
                  ) : null}
            </GridItem>

            <GridItem colSpan={5}  borderWidth='1px'
              borderColor={borderColor}
              rounded='md' display="flex" height='400px' p="2" >
              <List>
                  <Heading size='md'>Required Bodies </Heading><br/>
                    {bodies.length > 0 ? (
              <>
                {bodies.map((pos, index) => (
                  <Box key={pos.id}>
                    <Button mb='10px' bg={colors[pos.position_name]} size='lg' onClick={() => {
                      setPositionId(pos.id)
                      }} >
                        {pos.position_name}  {pos.user_id ? pos.victim : "empty"}
                    </Button>
                  </Box>
                ))}
              </>
                ) : null}
              </List>
            </GridItem>

            <GridItem colSpan={3}  borderWidth='1px'
              borderColor={borderColor}
              rounded='md' display="flex" p="2" >
              <List>
                <Heading size='md'>Available Bodies </Heading>
                <Divider marginY="1em"/>
                {users.length > 0 ? (
                  <>
                  <Stack direction="row" flexWrap="wrap" key={1}>
                    {users.map((user, index) => (
                      <>
                        <Button size="md" mb='10px' bg={colors[user.busy]} onClick={()=>handleBodyClicked(user.id, user.name)} key={user.id}>{user.name}</Button>
                      </>
                    ))}
                    </Stack>
                  </>
                ) : null}
              </List>
            </GridItem>
          </Grid>
    </> ): null}
  </Box>
  );
}