"use client";
import axios from "axios"
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import { useEffect, useState, useRef } from "react"
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function Body(props) {
    const navigate = useNavigate()
    const id = props.id || {}
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

    // רינדור עמודת תמונה (אם יש תמונה מציגים אותה, אחרת מציגים אות ראשונה)
    const avatarBodyTemplate = (rowData) => {
        return typeof rowData.avatar === "string" && rowData.avatar.startsWith("http") ? (
            <Avatar image={rowData.avatar} shape="circle" size="large" />
        ) : (
            <Avatar label={rowData.avatar} shape="circle" size="large" />
        );
    };

    const detailsClient = (rowData) => {
        const handleDelete = async () => {
            const client = { id: rowData._id, managerid: id, projectid: rowData.projectid }
            try {
                const res = await axios.delete(`http://localhost:2000/api/users/deleteClient`,
                    {
                        data: client,
                        headers: { Authorization: `Bearer ${token} ` }
                    })
                if (res.status === 200) {
                    const clients = res.data.map(client => { return { ...client.clientid, project: client.projectid.name } })
                    setContacts(clients)
                }
            } catch (err) {
                console.error(err)
            }
        };

        const handleEdit = () => {
            navigate(`./editClient`, { state: { id, rowData } })
        };

        const handleDetails = () => {
            navigate(`./details/${rowData._id}`, { state:{id,rowData,num:5} })
        };
        return (
            <>
                <Button icon="pi pi-trash" className="p-button-text" onClick={handleDelete} />
                <Button icon="pi pi-pencil" className="p-button-text" onClick={handleEdit} />
                <Button label="Details" icon="pi pi-eye" className="p-button-text" onClick={handleDetails} />
            </>
        );
    };

    return (
        <div className="card">
            <h2>Clients</h2>
            <DataTable value={contacts} responsiveLayout="scroll">
                <Column field="name" header="Name" />
                <Column field="email" header="Email" />
                <Column field="phone" header="Phone" />
                <Column field="project" header="Project" />
                <Column header="Profile" body={avatarBodyTemplate} />
                <Column header="Details" body={detailsClient} />

            </DataTable>
        </div>
    );
}

