import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom'
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
  HStack,
  VStack,
  Box
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'

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


function EventsDetailsPage () {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState([]);
  const [positions, setPositions] = useState([]);
  const [users, setUsers] = useState([])

  const eventInfoFetch = async () => {
    try{
      const response = await fetch(`${requestServer}events/?id=${id}`,fetchHeader);
      const data = await response.json();

      setEventInfo(data);

    } catch (error){
      console.log(error)
    }
  }
  const positionsFetch = async () => {
    try{
      const response = await fetch(`${requestServer}positions/?id=${id}`, fetchHeader);
      const data = await response.json();

      setPositions(data);
    } catch (error){
      console.log(error)
    }
  }

  const userFetch  = async () => {
    try{
      const response = await fetch(`${requestServer}users`, fetchHeader);
      const data = await response.json();
      setUsers(data)

    } catch (error){
      console.log(error)
    }
  }

  useEffect(()=>{
    eventInfoFetch()
    positionsFetch()
    userFetch()
  },[])

  return(
    <div>
      {eventInfo.length > 0 ? (
                <>
                  {eventInfo.map((e) => (
                    <div>
                      <Heading>{e.name}</Heading>
                      <Heading size='sm'>Location: {e.location}<br/>
                      POC: {e.POCinfo}</Heading>
                      <br/><br/>
                      {e.startDate.slice(0, e.startDate.indexOf('T'))}
                      <HStack>
                        {positions.map((pos) => (
                          <Button key={pos.id} bg={colors[pos.name]}>{pos.name} - {users[pos.users_id].name}</Button>
                        ))}
                      </HStack>


                    </div>
                  ))}
                </>
                  ) : null}


    </div>


  )
}


export default EventsDetailsPage