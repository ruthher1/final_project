import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { TabView, TabPanel } from 'primereact/tabview';
import { User, Mail, Phone, Lock,MapPin  } from 'lucide-react';
import axios from "axios"


export default function Settings(props) {
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const id=props.id||{}
    const manager=props.manager||{}
    const setManager=props.setManager||{}

const updateUser=async()=>{

    try {
        const res = await axios.put(`http://localhost:2000/api/users/updateUser`,{...manager,id:manager._id},
          { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
        alert("updated")
        }
      }
      catch (err) {
        console.error(err)
      }
    }
const changePassword=async()=>{
    try {
        const res = await axios.put(`http://localhost:2000/api/users/changePassword`,{id:manager._id,password:manager.password,newpassword:manager.newpassword},
          { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
        alert("updated")
        }
      }
      catch (err) {
        console.error(err)
      }
    }

    const handleChange = (e) => {
        
        setManager({ ...manager, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto py-10 card">
            <Card className="text-center">
                <Avatar image={manager.imageURL} size="xlarge" shape="circle" className="mx-auto mb-4" icon="pi pi-user"  style={{ transform: 'scale(1.5)' }}/>
                <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
            </Card>

            <TabView className="mt-6" >
                <TabPanel header="General" >
                    <Card >
                        <div >
                            <div className="flex align-items-center mb-4">
                                <User size={18} className="mr-2" />
                                <InputText name="name" value={manager.name} onChange={handleChange} style={{ width: '50%' }} />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Mail size={18} className="mr-2" />
                                <InputText name="email" value={manager.email} onChange={handleChange} style={{ width: '50%' }} />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Phone size={18} className="mr-2" />
                                <InputText name="phone" value={manager.phone} onChange={handleChange} style={{ width: '50%' }}  />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <MapPin  size={18} className="mr-2" />
                                <InputText name="address" value={manager.address} onChange={handleChange} style={{ width: '50%' }}  />
                            </div>
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
                            <Button className="input-focus" label="Update Password" style={{ width: '20%' ,marginLeft:"2.3%",color: "green", background: "white", border: '1px solid green'}} onClick={changePassword} />
                        </div>
                    </Card>
                </TabPanel>
            </TabView>
        </div>
    );
}