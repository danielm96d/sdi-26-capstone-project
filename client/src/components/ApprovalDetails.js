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
  const [eventInfo, setEventInfo] = useState({});
  const [conflicts, setConflicts] = useState([])
  const [usersEvents, setUsersEvents] = useState([])
  const navigate = useNavigate();

  const dateTimeString = (date, time) => {
    return `${date.slice(0, date.indexOf('T'))}T${time.slice(0, 5)}`
  }

  const getPotentialConflicts = async (filteredEvents) => {
    filteredEvents.map((event) => {
      console.log(event.events_id)
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
      const data = await response.json();
      console.log(data[0])
      console.log(data[0].position[0].user_id)
      setEventInfo(data[0]);
      const responseUserData = await fetch(`${requestServer}users?id=${data[0].position[0].user_id}`,fetchHeader);
      const userData = await responseUserData.json();
      console.log(userData[0].positions)
      console.log(id)
      let filteredEvents = userData[0].positions.filter((event) => event.events_id != id)
      console.log(filteredEvents)
      getPotentialConflicts(filteredEvents)

    } catch (error){
      console.log(error)
    }
  }


  useEffect(()=>{
    //compare times and place conflicts on table
    if (usersEvents.length > 0 && Object.keys(eventInfo).length !== 0){
      console.log(eventInfo)
      let oStart = dateTimeString(eventInfo.startDate, eventInfo.startTime);
      let oEnd = dateTimeString(eventInfo.endDate, eventInfo.endTime);
      
      // usersEvents.map((event) => {
      //   let start = `${event.startDate.slice(0, event.startDate.indexOf('T'))}T${event.startTime.slice(0, 5)}`;
      //   let end = `${event.endDate.slice(0, event.endDate.indexOf('T'))}T${event.endTime.slice(0, 5)}`;
      //   console.log(start)
      //   console.log(end)
      // })

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
    //    1100 > 1000 &&   1400 > 1200
    // if origStart > start && origEnd > end

      //    1000 > 0900 &&   1100 < 1200 ---conflict
    // if origStart > start && origEnd < end
    
      //    0900 < 1000 &&   1200 > 1100  ---conflict
    // if origStart < start && origEnd > end
    //

    //    0900 < 1000 &&   1100 < 1200 ---conflict
    // if origStart < start && origEnd < end
    //
  }, [usersEvents])


  useEffect(()=>{
    eventInfoFetch()
    // userFetch()
  },[])

  return(
    <div>
      {Object.keys(eventInfo).length !== 0  ? (
                <>
                  
                    <div>
                      <Heading>{eventInfo.name}</Heading>
                      <Heading size='sm'>Location: {eventInfo.location} Start: {dateTimeString(eventInfo.startDate, eventInfo.startTime)} End: {dateTimeString(eventInfo.endDate, eventInfo.endTime)}</Heading>
                      <Heading size='sm'>POC: {eventInfo.POCinfo}</Heading>
                      <br/><br/>
                      {eventInfo.description}
                      {usersEvents.length > 0 ? (<>{console.log(usersEvents)}</>) : null}
                      <br />
                      {conflicts.length > 0 ? (conflicts.map((conflict) => {
                        return (
                        <div>{`${conflict.name} : Start: ${dateTimeString(conflict.startDate, conflict.startTime)} End: ${dateTimeString(conflict.endDate, conflict.endTime)}`}</div>
                        )
                      })) : "\n No conflicts"}
                      <HStack>
                      </HStack>
                    </div>
                  
                </>
                  ) : null}
    </div>
  )
}


export default ApprovalDetailsPage