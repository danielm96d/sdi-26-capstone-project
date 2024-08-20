import React, {useState, useEffect} from "react";

function ApprovalPage() {
  const fetchHeader = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  }

  // const [approverDetails, setApproverDetails] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);

  const eventsServer = "http://localhost:8080/events"

  useEffect(() => {
      fetch(eventsServer, fetchHeader)
      .then((res) => res.json())
      .then((data)=> {
        setEventInfo(data)
        console.log('data: ', data)
      })
  }, []);


  if(!eventInfo){
    return "Loading"
  } 
  return (
    <>
        <h1>Approval Page</h1>
        <div>{eventInfo[0]}</div>
    </>
  )
}

export default ApprovalPage;