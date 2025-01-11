// import React from "react";
// import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate=useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
   
const onSubmit = async(data) => {
    try {        
        const res = await axios.post('http://localhost:2000/api/organizers/addOrganizer', data)
        if (res.status === 200) {
            localStorage.setItem('token',JSON.stringify(res.data.accessToken))
            navigate(`../organizer/${data.userid}`,{state: data.userid})
        }
    } catch (e) {
        console.error(e)
    }
}
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Card title="AAAAAAAAAAAAAAAAAA" subTitle="SignUp" className="md:w-30rem custom-card p-card-subtitle"  >

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Full Name</label>
                            <InputText className=" input-focus"  {...register("name", { required: true })} />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">ID</label>
                            <InputText className=" input-focus" {...register("userid", { required: true ,maxLength: 9,minLength: 9})} />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Password</label>
                            <InputText className=" input-focus" {...register("password", { required: true })} />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Email</label>
                            <InputText className=" input-focus" defaultValue="aaa@gmail.com" {...register("email", { required: true,pattern: { value: /^\S+@\S+\.\S+$/, message: 'not correct email' } })} />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Phone</label>
                            <InputText className=" input-focus" {...register("phone",{maxLength: 20})} />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Address</label>
                            <InputText className=" input-focus" {...register("address")} />
                        </div>

                        {errors.exampleRequired && <span>This field is required</span>}

                        <input type="submit" />
                    </div>

                </form>
            </Card>
        </div>
    )
}
export default SignUp