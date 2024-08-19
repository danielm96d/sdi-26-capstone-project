import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  GridItem,
  Image,
  Box,
  Avatar,
  useDisclosure,
  Lorem,
  Select,
  Input,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';

import interactionPlugin from '@fullcalendar/interaction';
import './Profile.css';
import RequestModal from './request'
import { useNavigate } from 'react-router-dom';
import {Helmet} from 'react-helmet'
const requestServer = 'http://localhost:8080/'

function Profile() {
  const [userInfo, setUserInfo] = useState({})
  const [notifications, setNotifications] = useState()
  const [dayEvents, setDayEvents] = useState()
  const [weekEvents, setWeekEvents] = useState()
  const [listDayVar, setListDayVar] = useState();
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
    fetch(requestServer + `users?id=${localStorage.getItem("id") || 0}`, {
      method: "GET",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(json => setUserInfo(json))
  }, [])


  const eventClickHander = () => {
    let new3;
  }
  useEffect(() => {
    // userInfoFetch();
    notificationsFetch();
    weekEventsFetch();
    dayEventsFetch();
  }, [])

  // const userInfoFetch = async () => {
  //   try{
  //     const response = await fetch(requestServer);
  //     const data = await response.json();
  //     setUserInfo(data);
  //   } catch (error){
  //     console.log(error)
  //   }
  // }
  const notificationsFetch = async () => {
    try {
      const response = await fetch(requestServer);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.log(error)
    }
  }
  const weekEventsFetch = async () => {
    try {
      const response = await fetch(requestServer);
      const data = await response.json();
      setWeekEvents(data);
    } catch (error) {
      console.log(error)
    }
  }
  const dayEventsFetch = async () => {
    try {
      const response = await fetch(requestServer);
      const data = await response.json();
      setDayEvents(data);
    } catch (error) {
      console.log(error)
    }
  }

  function handleDateSelect(selectInfo) {
    let selectedDate = selectInfo.startStr;
    console.log(selectInfo.startStr)
    calenderRef.current.getApi().gotoDate(selectedDate)

  }

  {/* <Image
     borderRadius='full'
     boxSize='150px'
     src={process.env.PUBLIC_URL + '/elonez.jpg'}
     alt='Dan Abramov'
     mt='50px'
     /> */}


  if (Object.keys(userInfo).length < 1) {
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
              initialDate={listDayVar ? (listDayVar) : null}
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


// <FullCalendar
//       plugins={[dayGridPlugin, interactionPlugin]}
//       height="90%"
//       initialView='dayGridMonth'
//       events={monthEvents}
//       selectable={true}
//       selectMirror={true}
//       select={handleDateSelect}
//       eventClick={(info)=>{navigate(`/scheduler/${info.event.id}`)
//       }}
//     />
