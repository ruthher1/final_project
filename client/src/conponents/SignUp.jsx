
import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { useRef } from "react";
const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const toast = useRef(null);

  
    const onSubmit = async (data) => {
        try {
            console.log(data);
            const res = await axios.post('http://localhost:2000/api/users/addManager', data);
            if (res.status === 200) {
                navigate("../");
            }
        } catch (e) {
            console.error(e);
            toast.current.show({severity:'error', summary: 'Error', detail:e.response.data, life: 3000});
        }
    };

    const renderField = (label, name, rules, type = "text", defaultValue = "") => (
        <div className="flex flex-column" style={{ width: '100%', alignItems: 'center' }}>
            <div className="flex flex-wrap justify-content-center align-items-center gap-2" style={{ width: '100%' }}>
                <label className="w-6rem">{label}</label>
                <div style={{ flex: 1 }}>
                    <InputText
                        type={type}
                        defaultValue={defaultValue}
                        {...register(name, rules)}
                        className="input-focus"
                        style={{ width: '100%' }}
                    />
                    {errors[name] && <small style={{ color: 'red', display: 'block', marginTop: '4px' }}>{errors[name].message}</small>}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Toast ref={toast} />
            <Card title="Task Track" subTitle="SignUp" className="md:w-30rem custom-card p-card-subtitle">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>

                        {renderField("Full Name", "name", {
                            required: "Name is required"
                        })}

                        {renderField("ID", "userid", {
                            required: "ID is required",
                            minLength: { value: 9, message: "ID must be exactly 9 digits" },
                            maxLength: { value: 9, message: "ID must be exactly 9 digits" },
                            pattern: { value: /^[0-9]+$/, message: "ID must contain only numbers" }
                        })}

                        {renderField("Password", "password", {
                            required: "Password is required"
                        }, "password")}

                        {renderField("Email", "email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" }
                        }, "text", "aaa@gmail.com")}

                        {renderField("Phone", "phone", {
                            required: "Phone is required",
                            maxLength: { value: 20, message: "Phone number is too long" }
                        })}

                        {renderField("Address", "address", {})}

                        {renderField("Project Name", "projectName", {
                            required: "Project Name is required"
                        })}

                        <input type="submit" value="Sign in" className="custom-button" />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SignUp;