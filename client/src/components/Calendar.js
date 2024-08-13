import React, { useState, useEffect, useRef } from 'react';
import {useNavigate} from 'react-router-dom'
import {
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { useDisclosure, Lorem, Select, Input} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import interactionPlugin from '@fullcalendar/interaction';

const requestServer = 'http://localhost:8080/'

export default function Calendar () {
  const [dayEvents, setDayEvents] = useState()
  const [monthEvents, setMonthEvents] = useState()
  const calenderRef = useRef(null);

  const navigate = useNavigate('/')

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
  const dayEventsFetch = async (selectedDate) => {
    try{
      const response = await fetch(requestServer);
      const data = await response.json();
      setDayEvents(data);
    } catch (error){
      console.log(error)
    }
  }

  function handleDateSelect(selectInfo) {
    let selectedDate =selectInfo.startStr;
    console.log(selectInfo.startStr)
    calenderRef.current.getApi().gotoDate(selectedDate)

  }


  const calendarDataCalendar = [
    {
      title: "Cyber Week2",

      borderColor: "transparent",
      start: "2024-08-13T13:30",
      end: "2024-08-13T14:00",
      backgroundColor: "#805AD5",
      className: "warning"
    },
    {
      title: "Cyber Week",

      borderColor: "transparent",
      start: "2024-08-13T06:30",
      end: "2024-08-13T12:00",
      backgroundColor: "#805AD5",
      className: "warning"
    },
    {
      title: "Cyber Week2",

      borderColor: "transparent",
      start: "2024-08-13",
      end: "2024-08-13",
      backgroundColor: "#805AD5",
      className: "warning"
    }
  ];
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
        events={calendarDataCalendar}
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
        eventClick={()=>navigate('/scheduler')}
      />
      </GridItem>
      <GridItem colSpan={3}  display="flex" alignItems="center" flexDirection="column" borderWidth='1px'
    borderColor='black'
    rounded='md'>
      <FullCalendar
        ref={calenderRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        height="90%"
        initialView='timeGridDay'
        events={calendarDataCalendar}
        selectMirror={true}
        select={handleDateSelect}
        eventClick={()=>navigate('/scheduler')}
      />
    </GridItem>
      </Grid>
    )
}