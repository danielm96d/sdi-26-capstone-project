import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect} from 'react'

export default function MiddleWare(){
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {isRequest} = location.state
  // console.log(isRequest)

  useEffect(()=>{
    if(isRequest){
    navigate(`/approval-details/${id}`)
  } else {
    navigate(`/scheduler/${id}`)
  }})

}