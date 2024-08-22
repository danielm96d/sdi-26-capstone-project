import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useAuth() {
    const [auth, setAuth] = useState(null);
    const [userInfo, setUserInfo] = useState({})
    let isAllowed = false;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/login" && location.pathname !== '/sign-up') {
            fetch('http://localhost:8080/validate', {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(json => {
                    setAuth(json)
                })
                .catch(() => setAuth({ invalid: true }));
            fetch('http://localhost:8080/users/self', {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(json => setUserInfo(json[0]))
            .catch(err => console.log(err))
        }
    }, [location]);

    useEffect(() => {
        if (auth !== null) {
            if (auth.invalid) {
                if(localStorage.getItem('id')) {
                    localStorage.removeItem('id')
                }
                navigate('/login')
            }
            
        }
        if(Object.keys(userInfo).length !== 0){
            console.log('userInfo in auth: ', userInfo)
            console.log('userInfo in auth: ', userInfo)
            isAllowed = userInfo.permissions.filter(item=>{
                console.log('pathname split [2]: ',location.pathname.split("/")[2] )
                console.log('item: ', item)
                return item == location.pathname.split("/")[2]
            }).length > 0
            console.log('isallowed: ', isAllowed)
        }
        if(location.pathname.split("/")[1] === "scheduler" && (!userInfo.isApprover || !isAllowed))  {
            navigate('/event-details/'+location.pathname.split("/")[2])
        } 
        if(location.pathname.split("/")[1] === "approval-details" && (!userInfo.isApprover || !isAllowed))  {
            navigate('/event-details/'+location.pathname.split("/")[2])
        } 
        if(location.pathname === "/approval" && (!userInfo.isApprover)) {
            navigate('/')
        }

    }, [auth, userInfo]);

}