import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  GridItem,
  Box,
  Avatar,
  Heading,
  Text
} from '@chakra-ui/react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';

import interactionPlugin from '@fullcalendar/interaction';
import './Profile.css';
import RequestModal from './request'
import {Helmet} from 'react-helmet'
const requestServer = 'http://localhost:8080/'

function Profile() {
  const [userInfo, setUserInfo] = useState({})
  const [notifications, setNotifications] = useState()
  const [ events, setEvents ] = useState([]);
  const calenderRef = useRef(null);

  const views = {
    dayGridFourWeek: {
      type: 'dayGrid',
      duration: { weeks: 1 },
      titleFormat: {
        month: 'short',
        year: '2-digit',
      },
      dayHeaderFormat: {
        weekday: 'narrow',
        day: 'numeric',
      }
    }
  }

  useEffect(() => {
    fetch(requestServer + `users/self`, {
      method: "GET",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json[0].events !== undefined){
          let arrEvents = [];
          json[0].events.map((event) => {
            let indexOfT = event.startDate.indexOf("T");
            arrEvents.push({
              id: event.id,
              title: event.name,
              start: `${event.startDate.slice(0, indexOfT)}T${event.startTime}`,
              end: `${event.endDate.slice(0, indexOfT)}T${event.endTime}`,
            })
          })
          setEvents(arrEvents);
          console.log(arrEvents)
        }
        setUserInfo(json)
      })
  }, [])

  function handleDateSelect(selectInfo) {
    let selectedDate = selectInfo.startStr;
    console.log(selectInfo.startStr)
    calenderRef.current.getApi().gotoDate(selectedDate)
  }

  if (Object.keys(userInfo).length < 1 || userInfo.invalid) {
    return (
      <Heading>Loading</Heading>
    )
  }

  console.log(userInfo)
  return (
    <>
      <Helmet>
        <title>OpSync | Profile</title>
      </Helmet>
      <Grid
        h='800px'
        templateColumns='repeat(8, minmax(120px, 1fr))'
        gap={4}
      >
        <GridItem colSpan={2} display="flex" alignItems="center" flexDirection="column" borderWidth='1px'
          borderColor='black'
          rounded='md'>
          <br />
          <Avatar name={userInfo[0].name} size='2xl' />
          <Box
            width='90%'
            height='60%'
            mt='50px'
            borderWidth='3px'
            borderColor='black'
            rounded='md'>

            User Info
            <Box>
              <Text>Hello {userInfo[0].name},</Text>
            </Box>
          </Box>

        </GridItem>
        <GridItem colSpan={3} borderWidth='1px'
          borderColor='black'
          rounded='md'
          p="5px">

          <div >
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView='dayGridFourWeek'
              views={views}
              height='200px'
              selectable={true}
              selectMirror={true}
              select={(selectInfo) => handleDateSelect(selectInfo)}
              events={events}
            />
          </div>
          <div >
            <FullCalendar
              ref={calenderRef}
              plugins={[listPlugin]}
              initialView='listDay'
              headerToolbar={false}
              height='200px'
              selectable={true}
              selectMirror={true}
              events={events}
            />
          </div>
        </GridItem>
        <GridItem colSpan={3} display="flex" alignItems="center" flexDirection="column" borderWidth='1px'
          borderColor='black'
          rounded='md'>
          <Box
            width='90%'
            height='60%'
            mt='50px'
            borderWidth='3px'
            borderColor='black'
            rounded='md'>
            Notifications
            {notifications}
          </Box>

          <RequestModal />


        </GridItem>
      </Grid>
    </>
  )
}

export default Profile;

