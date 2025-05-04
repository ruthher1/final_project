import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { TabView, TabPanel } from 'primereact/tabview';
import { User, Mail, Phone, Lock,MapPin  } from 'lucide-react';
import axios from "axios"
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast'; 


export default function Settings(props) {
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const location = useLocation();
    const id=useSelector(x=>x.Id.id)
    const client=props.client || {}
    const setClient=props.setClient || {}
    const setShowSettings=props.setShowSettings || {}
    const [newClient, setNewClient] = useState(client)
    const toast = useRef(null)

const updateUser=async()=>{

    try {
        const res = await axios.put(`http://localhost:2000/api/users/updateUser`,{...newClient,id:client._id},
          { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
        setClient(res.data)
        toast.current.show({ severity: 'success', summary: 'Updated', detail: "client details updated", life: 3000 });
    }
      }
      catch (err) {
        console.error(err)
      }
    }
const changePassword=async()=>{
    try {
        const res = await axios.put(`http://localhost:2000/api/users/changePassword`,{id:client._id,password:newClient.password,newpassword:newClient.newpassword},
          { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
            setClient(res.data)
            toast.current.show({ severity: 'success', summary: 'Updated', detail: "client password updated", life: 3000 });
        }
      }
      catch (err) {
        console.error(err)
      }
    }

    const handleChange = (e) => {
        
        setNewClient({ ...newClient, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto py-10 card">
             <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text"
                    style={{
                        color: "black",
                    }}
                    onClick={() => setShowSettings(false)}
                />
            <Card className="text-center">
                <Avatar image={client.imageURL} size="xlarge" shape="circle" className="mx-auto mb-4" icon="pi pi-user"  style={{ transform: 'scale(1.5)' }}/>
                <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
            </Card>

            <TabView className="mt-6" >
                <TabPanel header="General" >
                    <Card >
                        
                        <div >
                            <div className="flex align-items-center mb-4">
                                <User size={18} className="mr-2" />
                                <InputText name="name" value={newClient.name} onChange={handleChange} style={{ width: '50%' }} />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Mail size={18} className="mr-2" />
                                <InputText name="email" value={newClient.email} onChange={handleChange} style={{ width: '50%' }} />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Phone size={18} className="mr-2" />
                                <InputText name="phone" value={newClient.phone} onChange={handleChange} style={{ width: '50%' }}  />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <MapPin  size={18} className="mr-2" />
                                <InputText name="address" value={newClient.address} onChange={handleChange} style={{ width: '50%' }}  />
                            </div>
                            <Toast ref={toast} /> 
                            <Button className="input-focus" label="Save Changes" style={{ width: '20%' ,marginLeft:"2.3%",color: "green", background: "white", border: '1px solid green'}} onClick={updateUser} />
                        </div>
                    </Card>
                </TabPanel>

                <TabPanel header="Security" >
                    <Card>
                        <div className="p-6">
                            <div className="flex align-items-center mb-4">
                                <Lock size={18} className="mr-2" />
                                <InputText type="password" placeholder="Old Password" name="password" onChange={handleChange}style={{ width: '50%' }}  />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Lock size={18} className="mr-2" />
                                <InputText type="password" placeholder="New Password" name="newpassword" onChange={handleChange}style={{ width: '50%' }}  />
                            </div>
                            <Toast ref={toast} /> 
                            <Button className="input-focus" label="Update Password" style={{ width: '20%' ,marginLeft:"2.3%",color: "green", background: "white", border: '1px solid green'}} onClick={changePassword} />
                        </div>
                    </Card>
                </TabPanel>
            </TabView>
        </div>
    );
}