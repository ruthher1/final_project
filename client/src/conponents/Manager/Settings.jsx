import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { TabView, TabPanel } from 'primereact/tabview';
import { User, Mail, Phone, Lock,MapPin  } from 'lucide-react';
import axios from "axios"
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast'; 


export default function Settings(props) {
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const id=useSelector(x=>x.Id.id)
    const manager = props.manager || {}
    const setManager = props.setManager || {}
    const [newManager, setNewManager] = useState(manager)
    const toast = useRef(null)
    
const updateUser=async()=>{

    try {
        const res = await axios.put(`http://localhost:2000/api/users/updateUser`,{...newManager,id:manager._id},
          { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
        setManager(res.data)
        toast.current.show({ severity: 'success', summary: 'Updated', detail: "manager details updated", life: 3000 });
        }
      }
      catch (err) {
        console.error(err)
      }
    }
const changePassword=async()=>{
    try {
        const res = await axios.put(`http://localhost:2000/api/users/changePassword`,{id:manager._id,password:newManager.password,newpassword:newManager.newpassword},
          { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
            setManager(res.data)
            toast.current.show({ severity: 'success', summary: 'Updated', detail: "manager password updated", life: 3000 });
        }
      }
      catch (err) {
        console.error(err)
      }
    }

    const handleChange = (e) => {
        
        setNewManager({ ...newManager, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto py-10 card"  style={{
            margin: '5% ',
            marginTop: '5%',
            padding: '30px',
          }}>
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
                                <InputText name="name" value={newManager.name} onChange={handleChange} style={{ width: '50%' }} />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Mail size={18} className="mr-2" />
                                <InputText name="email" value={newManager.email} onChange={handleChange} style={{ width: '50%' }} />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Phone size={18} className="mr-2" />
                                <InputText name="phone" value={newManager.phone} onChange={handleChange} style={{ width: '50%' }}  />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <MapPin  size={18} className="mr-2" />
                                <InputText name="address" value={newManager.address} onChange={handleChange} style={{ width: '50%' }}  />
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