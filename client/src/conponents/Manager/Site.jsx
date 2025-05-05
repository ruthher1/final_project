import { useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import Header from './Header';
import Body from './Body';
import AddForm from './AddForm';
import UpdateForm from './UpdateForm';
import Settings from './Settings';
import DetailsCalander from './DetailsCalander';
import axios from "axios"

import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import Help from './HelpPage';
import Statistiscs from './Statistiscs';

const Site = () => {
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const location = useLocation();
      const id=useSelector(x=>x.Id.id)
      let num=1
      let rowData = {}
      if(location.state){
        num = location.state.num || 0
        rowData = location.state.rowData || {}
      }
    // const num = location.state.num || 0
    // const rowData = location.state.rowData || {}
    const [contacts, setContacts] = useState([]);
    const [manager,setManager]=useState({})

      const getManager = async () => {
        try {
          const res = await axios.get(`http://localhost:2000/api/users/getUser/${id}`,
            { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 200) {
            setManager(res.data)
          }
        }
        catch (err) {
          console.error(err)
        }
      }
    
  useEffect(() => {
    getManager();
  }
    , [])
    return (
        <>
            <SideBar  contacts={contacts}  setContacts={setContacts} num={num} manager={manager} setManager={setManager}/>
            <div className="content">
                {num == 1 || num == 2 || num == 3 || num == 5 || num == 4||num==6 ||num==7? <Header  contacts={contacts} setContacts={setContacts} num={num} manager={manager} setManager={setManager}/> :null}
                <>
                    {num === 1 ? <Body  contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 2 ? <AddForm  contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 3 ? <UpdateForm contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 4 ? <Settings  contacts={contacts} num={num} setContacts={setContacts}manager={manager} setManager={setManager} /> : null}
                    {num === 5 ? <DetailsCalander  contacts={contacts} num={num} rowData={rowData} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 6 ? <Help  /> : null}
                    {num === 7 ? <Statistiscs/> : null}


                    {num !== 1 && num !==2 && num !== 3 && num !== 4 && num !== 5 && num !== 6 && num !== 7? <p>num: {num}</p> : null}
                </>
            </div>

         







        </>

    )
}
export default Site