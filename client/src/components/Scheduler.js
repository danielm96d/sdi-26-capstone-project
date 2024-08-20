import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import {
  Grid,
  GridItem,
  Button,
  Heading,
  Spacer,
  List
} from '@chakra-ui/react'

const requestServer = 'http://localhost:8080/'

const colors = {
  'Pallbearer': 'Salmon',
  'Bearer': 'Olive',
  'OIC': 'LightSkyBlue',
  'NCOIC':'LightGreen',
  'Firing Party': 'Gray',
  'Drill': 'Tomato',
  'Color Guard': 'Lavender',
  'Flag Holder': 'Silver',
  'Escort': 'Fuchsia',
  'Bugler': 'Gold',
  'clear user': 'Red'
}

const userColors = {
  'clear user': 'red'
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
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })})

    } catch (error){
      console.log(error)
    }
    navigate(-1)
  }

  const showRequiredBodies = async (posName) => {
    let filteredBodies = eventBodiesTotal.filter((position) => position.position_name === posName)
    setBodies(filteredBodies)
    const userResponse = await fetch(`${requestServer}users/`);
        const userData = await userResponse.json();
        setUsers(userData);
        setUsers(users => [...users, {name: "clear user"}])
  }

  const handleBodyClicked = (newValue, newName) => {
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

  useEffect(() => {
    eventInfoFetch()
  }, [])

  return (
    <div>
      {eventInfo ? (
        <>
          <Grid
            templateColumns='repeat(8, minmax(120px, 1fr))'
            templateRows='50px, 30px, 50px, 700px'
            gap={4}
            padding='5px'
          >
            <GridItem  borderWidth='1px'
              borderColor='black'
              rounded='md'
              display='flex' colSpan={8} rowSpan={1} p="5px">
                <Heading as='h2' size='2xl'>{eventInfo[0].name}</Heading>
                <Spacer />
                <Button bg='darkolivegreen' onClick={() => positionsInfoPatch()}>Save</Button>
                <Button onClick={() => navigate(-1)}>Back</Button>
                <Button bg='tomato' onClick={() => eventInfoDelete()}>Delete</Button>
            </GridItem>

            <GridItem colSpan={8} rowSpan={1}  borderWidth='1px'
              borderColor='black'
              rounded='md' display="flex" h="30px" p="5px">
              <Heading as='h4' size='l'>{`POC: ${eventInfo[0].POCinfo}  Location: ${eventInfo[0].location}`}</Heading>
            </GridItem>

            <GridItem colSpan={8} rowSpan={1}  borderWidth='1px'
              borderColor='black'
              rounded='md' display="flex" h="50px" p="5px">
                {positionsInfo.length > 0 ? (
                <>
                  {positionsInfo.map((pos, index) => (
                    <div key={index}>
                    <Button mr='10px' bg={colors[pos.name]} onClick={() => showRequiredBodies(pos.name)} >{pos.name}</Button>
                    </div>
                  ))}
                </>
                  ) : null}
            </GridItem>

            <GridItem colSpan={5}  borderWidth='1px'
              borderColor='black'
              rounded='md' display="flex" height='400px' p="2" >
              <List>
                  <Heading size='md'>Required Bodies </Heading><br/>
                    {bodies.length > 0 ? (
              <>
                {bodies.map((pos, index) => (
                  <div key={index}>
                    <Button mb='10px' bg={colors[pos.position_name]} size='lg' onClick={() => {
                      setPositionId(pos.id)
                      }} >
                        {pos.position_name}  {pos.user_id ? pos.victim : "empty"}
                    </Button>
                  </div>
                ))}
              </>
                ) : null}
              </List>
            </GridItem>

            <GridItem colSpan={3}  borderWidth='1px'
              borderColor='black'
              rounded='md' display="flex" p="2" >
              <List>
                <Heading size='md'>Available Bodies </Heading>
                {users.length > 0 ? (
                  <>
                    {users.map((user, index) => (
                      <div key={index}>
                        <Button mb='10px' bg ={colors[user.name]} size='lg' onClick={()=>handleBodyClicked(user.id, user.name)} >{user.name}</Button>
                      </div>
                    ))}
                  </>
                ) : null}
              </List>
            </GridItem>
          </Grid>
    </> ): null}
  </div>
  );
}