"use client";
import axios from "axios"   
import React, { useState ,useEffect} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AddForm(props) {
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

  const handleSubmit = async(e) => {
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
            navigate(`../manager/${id}` ,{state:{num:1}})
       }
    }
    catch (err) {
        console.error(err)
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-content">
      <div className="profile-section">
        <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="profile-avatar" />
      </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-user" /></span>
          <InputText name="name" placeholder="Full Name" value={contact.name} onChange={handleChange} required/>
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-id-card" /></span>
          <InputText name="userid" placeholder="ID" value={contact.userid} onChange={handleChange}required/>
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-phone" /></span>
          <InputText name="phone" placeholder="Phone"value={contact.phone} onChange={handleChange}/>
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-map-marker" /></span>
          <InputText name="address" placeholder="Address" value={contact.address} onChange={handleChange}/>
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-envelope" /></span>
          <InputText
            name="email" placeholder="Email" value={contact.email} onChange={handleChange} required/>
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-briefcase" /></span>
          <Dropdown 
          style={{ textAlign: 'left' }}
          value={selectedProject} 
          onChange={(e) => {setSelectedProject(e.value)}} 
          options={projects} 
          optionLabel="name"
          placeholder="Project" 
          required
          className="w-full md:w-14rem" />
        </div>

        <Button type="submit" label="Save" className="p-button-outlined save-btn" />

      </form>
    </div>
  );
}
