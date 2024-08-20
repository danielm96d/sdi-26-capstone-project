import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  GridItem,
} from '@chakra-ui/react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import interactionPlugin from '@fullcalendar/interaction';
import { Helmet } from 'react-helmet';

const requestServer = 'http://localhost:8080/'

export default function Calendar() {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }
  const [monthEvents, setMonthEvents] = useState()
  const calenderRef = useRef(null);

  const navigate = useNavigate('/')


  useEffect(() => {
    monthEventsFetch();
  }, [])

  const monthEventsFetch = async () => {
    try {
      const response = await fetch(`${requestServer}events`, fetchHeader)
      const data = await response.json();
      console.log(data)
      let copiedData = data;
      data.map((event, index) => {
        let indexOfT = event.startDate.indexOf("T");
        copiedData[index].start = `${event.startDate.slice(0, indexOfT)}T${event.startTime}`
        copiedData[index].end = `${event.endDate.slice(0, indexOfT)}T${event.endTime}`
        copiedData[index].title = `${event.name}`
        let bg = 'blue'
        let textColor = 'white'
        if (event.type === 'Retirement') {
          bg = 'green'
        }
        if (event.type === 'Funeral') {
          bg = 'tomato'
        }
        if (event.type === 'Inauguration') {
          bg = 'papayawhip'
          textColor = 'black'
        }
        copiedData[index].backgroundColor = bg;
        copiedData[index].textColor = textColor
        // copiedData[index].allDay = `${event.endDate.slice(0, indexOfT)}T${event.endTime}`
        delete copiedData[index].endDate;
        delete copiedData[index].endTime;
        delete copiedData[index].startDate;
        delete copiedData[index].startTime;
      })
      setMonthEvents(copiedData);
      console.log(copiedData)
    } catch (error) {
      console.log(error)
    }
  }
  

  function handleDateSelect(selectInfo) {
    let selectedDate = selectInfo.startStr;
    console.log(selectInfo.startStr)
    calenderRef.current.getApi().gotoDate(selectedDate)

  }

  return (
    <>
      <Helmet>
        <title>OpSync | Calendar</title>
      </Helmet>
      <Grid
        h='800px'
        templateColumns='repeat(8, minmax(120px, 1fr))'
        gap={4}
      >
        <GridItem colSpan={5} borderWidth='1px'
          borderColor='black'
          rounded='md'>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            height="90%"
            initialView='dayGridMonth'
            events={monthEvents}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            eventClick={(info) => {
              navigate(`/scheduler/${info.event.id}`)
            }}
          />
        </GridItem>
        <GridItem colSpan={3} display="flex" alignItems="center" flexDirection="column" borderWidth='1px'
          borderColor='black'
          rounded='md'>
          <FullCalendar
            ref={calenderRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            height="90%"
            initialView='timeGridDay'
            events={monthEvents}
            selectMirror={true}
            select={handleDateSelect}
            eventClick={(info) => {
              navigate(`/scheduler/${info.event.id}`)
            }}
          />
        </GridItem>
      </Grid>
    </>
  )
}