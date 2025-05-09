
import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import{Toast} from 'primereact/toast'
import { useRef } from "react";
const SignUp = () => {
    const toast = useRef(null);
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors }, } = useForm()

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const res = await axios.post('http://localhost:2000/api/users/addManager', data)
            if (res.status === 200) {
                navigate(`../`)
            }
        } catch (e) {
            console.error(e)
                toast.current.show({ severity: 'error', summary: 'Error', detail: e.response.data, life: 3000 });
           
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Toast ref={toast} />
            <Card title="Task Track" subTitle="SignUp" className="md:w-30rem custom-card p-card-subtitle"  >

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Full Name</label>
                            <InputText required className=" input-focus"  {...register("name")} />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">ID</label>
                            <InputText required className="input-focus" {...register("userid", {
                                minLength: { value: 9, message: "ID must be exactly 9 digits" },
                                maxLength: { value: 9, message: "ID must be exactly 9 digits" },
                                pattern: { value: /^[0-9]+$/, message: "ID must contain only numbers" }
                            })} />
                        </div>
                        <div>{errors.userid && <small style={{ color: "red" }}>{errors.userid.message}</small>}</div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Password</label>
                            <InputText required className=" input-focus" type="password" {...register("password")} />

                        </div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Email</label>
                            <InputText required type="email" className=" input-focus" defaultValue="aaa@gmail.com" {...register("email")} />
                        </div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Phone</label>
                            <InputText required className=" input-focus" {...register("phone")} />

                        </div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Address</label>
                            <InputText className=" input-focus" {...register("address")} />
                        </div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Project Name</label>
                            <InputText required className=" input-focus" {...register("projectName")} />
                          </div>
                        <input type="submit" value="Sign in" class="custom-button"/>
                    </div>

                </form>
            </Card>
        </div>
    )
}
export default SignUp