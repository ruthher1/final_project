
import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors }, } = useForm()

    const onSubmit = async (data) => {
        try {
            console.log(data)
            const res = await axios.post('http://localhost:2000/api/users/addManager', data)
            if (res.status === 200) {
                navigate(`../`)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card title="Task Track" subTitle="SignUp" className="md:w-30rem custom-card p-card-subtitle"  >

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Full Name</label>
                            <InputText className=" input-focus"  {...register("name", {required: "Name is required" })} />
                        </div>
                        <div>{errors.name && <small style={{ color: "red" }}>{errors.name.message}</small>}</div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">ID</label>
                            <InputText className="input-focus" {...register("userid", {
                                required: "ID is required",
                                minLength: { value: 9, message: "ID must be exactly 9 digits" },
                                maxLength: { value: 9, message: "ID must be exactly 9 digits" },
                                pattern: { value: /^[0-9]+$/, message: "ID must contain only numbers" }
                            })} />
                        </div>
                        <div>{errors.userid && <small style={{ color: "red" }}>{errors.userid.message}</small>}</div>


                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Password</label>
                            <InputText className=" input-focus" type="password" {...register("password", { required: "Password is required" })} />

                        </div>
                        <div>{errors.password && <small style={{ color: "red" }}>{errors.password.message}</small>}</div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Email</label>
                            <InputText className=" input-focus" defaultValue="aaa@gmail.com" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" } })} />
                        </div>
                        <div>{errors.email && <small style={{ color: "red" }}>{errors.email.message}</small>}</div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Phone</label>
                            <InputText className=" input-focus" {...register("phone", { maxLength: 20,required:"Phone is required" })} />

                        </div>
                        <div>{errors.phone && <small style={{ color: "red" }}>{errors.phone.message}</small>} </div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Address</label>
                            <InputText className=" input-focus" {...register("address")} />
                        </div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Project Name</label>
                            <InputText className=" input-focus" {...register("projectName", { required: "Project Name is required" })} />
                          </div>
                          <div>{errors.projectName && <small style={{ color: "red" }}>{errors.projectName.message}</small>}</div>
                        <input type="submit" value="Sign in" class="custom-button"/>
                    </div>

                </form>
            </Card>
        </div>
    )
}
export default SignUp