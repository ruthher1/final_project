
"use client";
import axios from "axios"
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

export default function Header(props) {
  const [manager, setManager] = useState({});
  const id = props.id || {}
  const token = JSON.parse(localStorage.getItem('token')) || ""

  // const [image, setImage] = useState(null);

  const handleAvatarClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend =async () => {
        try {
          const res = await axios.put(`http://localhost:2000/api/users/addImage`,{id:id,imageURL:reader.result},
            { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 200) {
            setManager(res.data)
          }       
         } 
          catch (err) {
          console.error(err)
        }
        // setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getManager = async () => {
    try {
      const res = await axios.get(`http://localhost:2000/api/users/getManager/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {
        setManager(res.data)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  const searchName = (valName) => {
    console.log(valName)
    // contacts= contacts.filter((contact)=>{return contact.name.includes(valName)})
  }

  useEffect(() => {
    getManager()
  }
    , [])

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
        <span className="p-inputgroup-addon"><i className="pi pi-search" /></span>
        <InputText onChange={(e) => { searchName(e.target.value) }} type="text" className="p-inputtext-lg" placeholder="Search..." />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>{manager.name}</span>
        <Button icon="pi pi-bell" className="p-button-rounded p-button-text p-button-secondary" />
        <Button icon="pi pi-envelope" className="p-button-rounded p-button-text p-button-secondary" />
        <Button icon="pi pi-user" className="p-button-rounded p-button-text p-button-secondary" />
        <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-secondary" />
        {/* <Avatar 
        label='a' size="large" shape="circle" /> */}
        <div>
          <Avatar
            // label='a'
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
