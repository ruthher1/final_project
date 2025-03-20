import { useLocation } from 'react-router-dom';
import Aaa from './Aaa';
import Header from './Header';
import Body from './Body';
import AddForm from './AddForm';
import UpdateForm from './UpdateForm';
import Settings from './Settings';
import DetailsCalander from './DetailsCalander';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from "axios"

import { useState,useEffect } from 'react';


const Site = () => {
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const location = useLocation();
    const id = location.state.id || {}
    const num = location.state.num || 0
    const rowData = location.state.rowData || {}
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
            <Aaa id={id} setContacts={setContacts} num={num} manager={manager} setMnager={setManager}/>
            <div className="content">
                {/* <Header id={id} /> */}
                {num == 1 || num == 2 || num == 3 || num == 5 ? <Header id={id} contacts={contacts} setContacts={setContacts} num={num} manager={manager} setMnager={setManager}/> :null}
                <>
                    {num === 1 ? <Body id={id} contacts={contacts} num={num} setContacts={setContacts} manager={manager} setMnager={setManager}/> : null}
                    {num === 2 ? <AddForm id={id} contacts={contacts} num={num} setContacts={setContacts} manager={manager} setMnager={setManager}/> : null}
                    {num === 3 ? <UpdateForm id={id} contacts={contacts} num={num} setContacts={setContacts} manager={manager} setMnager={setManager}/> : null}
                    {num === 4 ? <Settings id={id} contacts={contacts} num={num} setContacts={setContacts}manager={manager} setMnager={setManager} /> : null}
                    {num === 5 ? <DetailsCalander id={id} contacts={contacts} num={num} rowData={rowData} setContacts={setContacts} manager={manager} setMnager={setManager}/> : null}
                    {num !== 1 && num !==2 && num !== 3 && num !== 4 && num !== 5 ? <p>num: {num}</p> : null}
                </>
            </div>

         







        </>

    )
}
export default Site