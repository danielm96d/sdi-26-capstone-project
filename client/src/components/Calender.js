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

const requestServer = 'http://localhost:8080/'

export default function Calender () {
  const [dayEvents, setDayEvents] = useState()
  const [monthEvents, setMonthEvents] = useState()

  useEffect(() => {
    monthEventsFetch();
    dayEventsFetch();
  }, [])

  const monthEventsFetch = async () => {
    try{
      const response = await fetch(requestServer);
      const data = await response.json();
      setMonthEvents(data);
    } catch (error){
      console.log(error)
    }
  }
  const dayEventsFetch = async () => {
    try{
      const response = await fetch(requestServer);
      const data = await response.json();
      setDayEvents(data);
    } catch (error){
      console.log(error)
    }
  }

  function handleDateSelect(selectInfo) {
    let calendarApi = selectInfo.view.calendar;
    console.log("clicked date")
  }

  return (
    <Grid
  h='800px'
  templateColumns='repeat(8, minmax(120px, 1fr))'
  gap={4}
>
<GridItem colSpan={5}   borderWidth='1px'
    borderColor='black'
    rounded='md'>
  <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        height="90%"
        initialView='dayGridMonth'
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
      />
      </GridItem>
      <GridItem colSpan={3}  display="flex" alignItems="center" flexDirection="column" borderWidth='1px'
    borderColor='black'
    rounded='md'></GridItem>
      </Grid>
    )
}