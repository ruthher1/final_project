import axios from "axios"   
import React, { useState ,useEffect, useRef} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from "primereact/progressspinner";

const AddForm=(props)=> {
    const toast = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [contact, setContact] = useState({
    name: "",
    userid: "",
    phone: "",
    address: "",
    email: "",
  });
  const id=useSelector(x=>x.Id.id)
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('token')) || ""
  const navigate=useNavigate()

   const getProjects = async () => {
    try {
        const res = await axios.get(`http://localhost:2000/api/projects/getProjects/${id}`,
            { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
            const dataProjects=res.data.map((project)=>{
                return project.projectid
            })
            setProjects(dataProjects)
        }
    }
    catch (err) {
        console.error(err)

    }
}

useEffect(() => {
    getProjects();

}, [])

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const onSubmit = async(e) => {
    e.preventDefault(); 
    const client = {
      ...contact,
      projectid: selectedProject._id,
      managerid: id,
      password:contact.phone
    };
    try {
    const res = await axios.post("http://localhost:2000/api/users/addClient", client,
            { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
            sentEmail(e,contact.name,contact.email)
            setContact({})
            // navigate(`../manager/${id}` ,{state:{num:1}})
       }
    }
    catch (err) {
        console.error(err)
        toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data, life: 3000 });
    }
  };


  const sentEmail = async (e,name,email) => {
        e.preventDefault();
        setLoading(true);
        try {
      const res=await axios.post('http://localhost:2000/api/email/send-email-to-client', {
        name,
        email,
        manager:props.manager.name
      });
      if (res.status === 200){
              // toast.current.show({ severity: 'success', summary: 'Success', detail: 'User was successfully. Email was sent to him', life: 3000 });
              navigate(`../manager/${id}` ,{state:{num:1}})
      } 
    } catch (err) {
      // alert('Failed to send: ' + err.response?.data?.error || err.message);
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.error || err.message, life: 3000 });
    }finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="form-container">
        <Toast ref={toast} />
      <form onSubmit={onSubmit} className="form-content">
      <div className="profile-section">
        <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="profile-avatar" />
        {loading && (
          <div style={{ margin: "20px" }}>
            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="5" />
          </div>
        )}
      </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-user" /></span>
          <InputText required name="name" placeholder="Full Name" value={contact.name} onChange={handleChange} />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-id-card" /></span>
          <InputText required name="userid" placeholder="ID" value={contact.userid} onChange={handleChange} />

        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-phone" /></span>
          <InputText required name="phone" placeholder="Phone"value={contact.phone} onChange={handleChange}/>
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-map-marker" /></span>
          <InputText name="address" placeholder="Address" value={contact.address} onChange={handleChange}/>
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-envelope" /></span>
          <InputText required type="email"
            name="email" placeholder="Email" value={contact.email} onChange={handleChange} />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-briefcase" /></span>
          <Dropdown 
          required
          style={{ textAlign: 'left' }}
          value={selectedProject} 
          onChange={(e) => {setSelectedProject(e.value)}} 
          options={projects} 
          optionLabel="name"
          placeholder="Project" 
          className="w-full md:w-14rem" />
        </div>
         <small className="text-left">*After saving the user, an email will be sent to them with the details.</small>
        <Button type="submit" label="Save" className="p-button-outlined save-btn" />

      </form>
    </div>
  );
}
export default AddForm;



























