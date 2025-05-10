
"use client";
import axios from "axios"
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header(props) {
  const manager = props.manager || {}
  const setManager = props.setManager || {}
  const id = useSelector(x => x.Id.id)
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const num = props.num || {}
  const navigate = useNavigate()
  const contacts = props.contacts || [];
  const [coppyContacts, setCoppyContacts] = useState([]);
  useEffect(() => {
    if (coppyContacts.length === 0) {
      setCoppyContacts([...contacts])
    }
  }, [contacts]);

  const setContacts = props.setContacts || {}

  const handleAvatarClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await axios.put(`http://localhost:2000/api/users/addImage`, { id: id, imageURL: reader.result },
            { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 200) {
            setManager(res.data)
          }
        }
        catch (err) {
    
          console.error(err)
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const searchName = (valName) => {
    setContacts(coppyContacts.filter((contact) => { return contact.name.includes(valName) }))
  }

  return (
    <div
      className="header-container"
      style={{
        border: "1px solid #ccc",
        position: "fixed",
        top: 0,
        left: "0",
        right: "0",
        width: "100%",
        height: "80px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 2
      }}
    >
      <h2></h2>
      <h2></h2>

      <div className="p-inputgroup" style={{ width: "45%" }}>
        {num === 1 ? <>
          <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
          </span>
          <InputText type="text" className="p-inputtext-lg" placeholder="Search..." onChange={(e) => { searchName(e.target.value) }} /></> : null
        }
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>{manager.name ? manager.name.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ') : ""}</span>
        <Button icon="pi pi-sign-out" className="p-button-rounded p-button-text p-button-secondary" onClick={() => { localStorage.removeItem("token"); navigate(`/`,) }} />
        <Button icon="pi pi-users" className="p-button-rounded p-button-text p-button-secondary" onClick={() => { num == 1 ? navigate(0, { state: { num: 1 } }) : navigate(`/manager/${id}`, { state: { num: 1 } }) }} />
        <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-secondary" onClick={() => { navigate(`/manager/${id}/settings`, { state: { num: 4 } }) }} />

        <div>
          <Avatar
            label={manager.imageURL ? "" : manager.name ? manager.name[0] : ""}
            size="large"
            shape="circle"
            onClick={handleAvatarClick}
            style={{
              cursor: "pointer",
              backgroundImage: `url(${manager.imageURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            src={manager.imageURL}
          />
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
      </div>

    </div>
  );
}
