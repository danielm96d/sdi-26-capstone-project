import React, { useState, useEffect } from 'react';
import {
  Grid,
  GridItem,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Card
} from '@chakra-ui/react'
import { useDisclosure, Lorem, Select, Input} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import interactionPlugin from '@fullcalendar/interaction';
import './Profile.css';


const requestServer = 'http://localhost:8080/'

function Profile() {

  function handleDateSelect(selectInfo) {
    let calendarApi = selectInfo.view.calendar;
    console.log("clicked date")



  }

  return(
    <Grid
  h='800px'
  templateColumns='repeat(8, minmax(120px, 1fr))'
  gap={4}
>
  <GridItem colSpan={2} bg='tomato'>
    Image
    User Info

  </GridItem>
  <GridItem colSpan={3} bg='papayawhip' >

    Events
    <div>
      <h1>Demo App</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridWeek'
        height = '200px'
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
      />
    </div>
  </GridItem>
  <GridItem colSpan={3} bg='papayawhip' >
    Hamburger
    Notifications
    Unavail Request
  </GridItem>
</Grid>
  )
}

export default Profile;