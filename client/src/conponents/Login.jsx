
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card';
import axios from 'axios'
import { RadioButton } from "primereact/radiobutton";
import { useDispatch, useSelector } from "react-redux"
import { Toast } from 'primereact/toast';
import { useRef } from "react";


const Login = () => {
    const [valueRole, setValueRole] = useState('');
    const [valueId, setValueId] = useState("")
    const [valuePass, setValuePass] = useState("")
    const navigate = useNavigate()
    const id=useSelector(x=>x.Id.id)
    const dispatch=useDispatch()
    const toast = useRef(null);

  
    const log_in = async () => {
        try {
            const res = await axios.post('http://localhost:2000/api/login', { userid: valueId, password: valuePass, role: valueRole })
            if (res.status === 200) {
                localStorage.setItem("token", JSON.stringify(res.data.accessToken))
                dispatch({type:"fill",payload:res.data.id})
                valueRole === "manager" ? navigate(`./manager/${res.data.id}`, { state: {num:1} }) : navigate(`./client/${res.data.id}`)

            }
        }
        catch (error) {
            console.error(error)
            toast.current.show({severity:'error', summary: 'Error', detail:error.response.data, life: 3000});
        }

    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Toast ref={toast} />
                <Card title="Task Track" subTitle="LogIn" className="md:w-30rem custom-card p-card-subtitle"  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">UserID</label>
                            <InputText id="userid" type="text" className="w-12rem input-focus" value={valueId} onChange={(e) => setValueId(e.target.value)} />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Password</label>
                            <InputText id="password" type="password" className="w-12rem input-focus" value={valuePass} onChange={(e) => setValuePass(e.target.value)} />
                        </div>
                        <div className="card flex justify-content-center">
                            <div className="flex flex-wrap gap-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient1" name="user" value="manager" onChange={(e) => setValueRole(e.value)} checked={valueRole === 'manager'} />
                                    <label htmlFor="ingredient1" className="ml-2">manager</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient4" name="user" value="client" onChange={(e) => setValueRole(e.value)} checked={valueRole === 'client'} />
                                    <label htmlFor="ingredient4" className="ml-2">client</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <Button label="Login" icon="pi pi-user" onClick={() => { log_in() }} className="w-10rem mx-auto" style={{ backgroundColor: 'var(--green-600)', border: 'none' }} ></Button>
                            <Link to="/signUp">Sign Up</Link>
                        </div>
                    </div>
                </Card>
            </div>

        </>

    )
}
export default Login