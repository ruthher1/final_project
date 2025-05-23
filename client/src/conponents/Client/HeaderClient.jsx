
"use client";
import axios from "axios"
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";
import Settings from "./Settings";

export default function HeaderClient(props) {
  const id=useSelector(x=>x.Id.id)
  const client=props.client||{}
  const setClient=props.setClient||{}
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false);

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
            setClient(res.data)
          }
        }
        catch (err) {
          console.error(err)
        }
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <>
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>{client.name?client.name.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' '):""}</span>
        <Button icon="pi pi-sign-out" className="p-button-rounded p-button-text p-button-secondary" onClick={() => {localStorage.removeItem("token");navigate(`/`, ) }} />
        <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-secondary" onClick={() => setShowSettings(true)} />
        <div>
          <Avatar
            label={client.imageURL?"": client.name ? client.name[0]:""}
            size="large"
            shape="circle"
            onClick={handleAvatarClick}
            style={{
              cursor: "pointer",
              backgroundImage: `url(${client.imageURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            src={client.imageURL}
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
    <div className="card">
                {showSettings && <Settings client={client} setClient={setClient} setShowSettings={setShowSettings}/>}
          </div>

    </>
  );
}
