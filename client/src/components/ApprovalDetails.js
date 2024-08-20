import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {
  Button,
  Heading,
  HStack
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
  const [eventInfo, setEventInfo] = useState([]);
  const navigate = useNavigate();

  const eventInfoFetch = async () => {
    try{
      const response = await fetch(`${requestServer}events/?id=${id}`,fetchHeader);
      const data = await response.json();
      console.log(data)
      setEventInfo(data);

    } catch (error){
      console.log(error)
    }
  }


  useEffect(()=>{
    eventInfoFetch()
  },[])

  return(
    <div>
      {eventInfo.length > 0 ? (
                <>
                  {eventInfo.map((e) => (
                    <div>
                      <Heading>{e.name}</Heading>
                      <Heading size='sm'>Location: {e.location} Start: {e.startDate.slice(0, e.startDate.indexOf('T'))} {e.startTime.slice(0, 5)} End: {e.endDate.slice(0, e.startDate.indexOf('T'))} {e.endTime.slice(0, 5)}</Heading>
                      <Heading size='sm'>POC: {e.POCinfo}</Heading>
                      <br/><br/>
                      {e.description}
                     
                      <HStack>
                      </HStack>
                    </div>
                  ))}
                </>
                  ) : null}
    </div>
  )
}


export default ApprovalDetailsPage