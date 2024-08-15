import React, { useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {
  Grid,
  GridItem,
  Button,
  Heading,
  Spacer
} from '@chakra-ui/react'

const requestServer = 'http://localhost:8080/'

export default function Scheduler () {
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [positionsInfo, setPositionsInfo] = useState([]);
  const navigate = useNavigate();

  const eventInfoFetch = async () => {
    try{
      const response = await fetch(`${requestServer}events/?id=${id}`);
      const data = await response.json();

      setEventInfo(data);

    } catch (error){
      console.log(error)
    }
  }
  const positionsInfoFetch = async () => {
    try{
      const response = await fetch(`${requestServer}positions?id=${id}`);
      const data = await response.json();
      const posArr = [];

      data.map((position) => {
        const index=
        let quantity = 1;
        console.log(positionArr)
        if(positionArr.length > 0){
          quantity = positionArr[0].quantity + 1;
        }
        let positionObj = {name:position.name, quantity: quantity}
        posArr.push(positionObj)
        console.log(positionObj)


      })
    setPositionsInfo(posArr);
      console.log(data)
    } catch (error){
      console.log(error)
    }
  }

  const eventInfoPatch = async () => {
    try{
      const response = await fetch(`${requestServer}events/${id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })})
      const data = await response.json();
      setPositionsInfo(data);
      console.log(data)
    } catch (error){
      console.log(error)
    }
  }

  const eventInfoDelete = async () => {
    try{
      const response = await fetch(`${requestServer}events/${id}`, {
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

  useEffect(()=>{
    eventInfoFetch()
    positionsInfoFetch();
  },[])

  return (
    <div>
      {eventInfo ? (
        <>
          <Grid
            templateColumns='repeat(8, minmax(120px, 1fr))'
            templateRows='50px, 50px, 700px'
            gap={4}
            padding='5px'
          >
            <GridItem  borderWidth='1px'
              borderColor='black'
              rounded='md'
              display='flex' colSpan={8} rowSpan={1} p="5px">
                <Heading as='h2' size='2xl'>{eventInfo[0].name}</Heading>
                <Spacer />
                <Button bg='darkolivegreen' onClick={() => eventInfoPatch()}>Save</Button>
                <Button onClick={() => navigate(-1)}>Back</Button>
                <Button bg='tomato' onClick={() => eventInfoDelete()}>Delete</Button>

            </GridItem>

            <GridItem colSpan={8} rowSpan={1}  borderWidth='1px'
              borderColor='black'
              rounded='md' display="flex" h="50px" p="5px">
            {positionsInfo.length > 0 ? (
            <>{console.log(positionsInfo)}
              {positionsInfo.map((pos, index) => (
                <div key={index}>

                  <Button mr='10px' onClick={() => {}} >{pos.name}{pos.quantity}</Button>
                </div>
              ))}
            </>
              ) : null}
              </GridItem>
              <GridItem colSpan={5}  borderWidth='1px'
              borderColor='black'
              rounded='md' display="flex" height='400px' >
                Required bodies
              </GridItem>
              <GridItem colSpan={3}  borderWidth='1px'
              borderColor='black'
              rounded='md' display="flex" >
                Available bodies
              </GridItem>


          </Grid>
      </>): null}
          </div>

        );






}