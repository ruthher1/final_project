"use client";
import axios from "axios"
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dropdown } from 'primereact/dropdown';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdateForm(props) {
  // const id = props.id || {}
      const id=useSelector(x=>x.Id.id)
  
  const rowData = props.rowData || {}
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const navigate = useNavigate()
  const [contact, setContact] = useState({
    name: rowData.name,
    userid: rowData.userid,
    phone: rowData.phone,
    address: rowData.address,
    email: rowData.email,
  });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = {
      ...contact,
      //   managerid: id,
    };
    try {
      const res = await axios.put("http://localhost:2000/api/users/updateUser", client,
        { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {
        navigate(`../manager/${id}`, { state: {num:1} })
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
          <InputText name="name" value={contact.name} onChange={handleChange} required />
        </div>

        <div className="p-inputgroup"><span className="p-inputgroup-addon"><i className="pi pi-id-card" /></span>
          <InputText name="userid" value={contact.userid} onChange={handleChange} required />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-phone" /></span>
          <InputText name="phone" value={contact.phone} onChange={handleChange} />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"> <i className="pi pi-map-marker" /></span>
          <InputText name="address" value={contact.address} onChange={handleChange} />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon"><i className="pi pi-envelope" /></span>
          <InputText name="email" value={contact.email} onChange={handleChange} required />
        </div>

        <Button type="submit" label="Update" className="p-button-outlined save-btn" />

      </form>

    </div>
  );
}
