"use client";
import axios from "axios"
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import { useEffect, useState, useRef } from "react"
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useSelector } from "react-redux";

export default function Body(props) {
    const navigate = useNavigate()
    // const id = props.id || {}
    const id=useSelector(x=>x.Id.id)
    
    const contacts = props.contacts || {}
    const setContacts = props.setContacts || {}
    const token = JSON.parse(localStorage.getItem('token')) || ""


    const getContacts = async () => {

        try {
            const res = await axios.get(`http://localhost:2000/api/users/getManagerClients/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const clients = res.data.map((client) => {
                    return { ...client.clientid, project: client.projectid.name, projectid: client.projectid._id }
                })
                setContacts(clients)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getContacts()
    }, [])

    const detailsClient = (rowData) => {
        const confirm = (event) => {
            confirmPopup({
              target: event.currentTarget,
              message: 'Do you want to delete this client?',
              icon: 'pi pi-info-circle',
              defaultFocus: 'reject',
              accept:(()=>{handleDelete()}),
              reject:()=>{}
            });
          };
        const handleDelete = async () => {
            const client = { id: rowData._id, managerid: id, projectid: rowData.projectid }
            try {
                const res = await axios.delete(`http://localhost:2000/api/users/deleteClient`,
                    {
                        data: client,
                        headers: { Authorization: `Bearer ${token} ` }
                    })
                if (res.status === 200) {
                    const clients = res.data.map(client => { return { ...client.clientid, project: client.projectid.name,projectid: client.projectid._id } })
                    setContacts(clients)
                }
            } catch (err) {
                console.error(err)
            }
        };

        const handleEdit = () => {
            navigate(`./editClient`, { state: { rowData ,num:3} })
        };

        const handleDetails = () => {
            navigate(`./details/${rowData._id}`, { state:{rowData,num:5} })
        };
        return (
            <>
                <ConfirmPopup/>
                <Button icon="pi pi-trash" className="p-button-text" onClick={(e)=>{confirm(e)}} />
                <Button icon="pi pi-pencil" className="p-button-text" onClick={handleEdit} />
                <Button label="Details" icon="pi pi-eye" className="p-button-text" onClick={handleDetails} />
            </>
        );
    };

    const avatarBodyTemplate = (rowData) => {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                
                    <Avatar
                        label={rowData.imageURL ?"":rowData.name ? rowData.name[0] : ""} 
                        size="large"
                        shape="circle"
                        style={{
                            backgroundImage: `url(${rowData.imageURL})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            marginRight: "10px",
                        }}
                        src={rowData.imageURL}
                    />
                
                <span>{rowData.name}</span>
            </div>
        );
    };

    return (
        <div className="card">
            <h2>Clients</h2>
            <DataTable value={contacts} responsiveLayout="scroll">
                <Column field="name" header="Name"  body={avatarBodyTemplate}/>
                <Column field="email" header="Email" />
                <Column field="phone" header="Phone" />
                <Column field="project" header="Project" />
                <Column header="Details" body={detailsClient} />
            </DataTable>
        </div>
    );
}

