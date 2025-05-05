"use client";
import axios from "axios"
import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Header from './Header';
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar } from 'primereact/calendar';
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from 'primereact/tooltip';

import { ConfirmPopup } from 'primereact/confirmpopup'; 
import { confirmPopup } from 'primereact/confirmpopup'; 
import { useSelector } from "react-redux";

import { Toast } from 'primereact/toast';
import { useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";

export default function Aaa(props) {

  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projects, setProjects] = useState([])
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const id=useSelector(x=>x.Id.id)
  const toast = useRef(null);
  const [showAddTaskToAllClients, setShowAddTaskToAllClients] = useState(false);
  const [taskToAllClients, setTaskToAllClients] = useState({
    managerid: id,
  });

  const [projectname, setProjectname] = useState("")
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const navigate = useNavigate()
  const setContacts = props.setContacts || {}
  const contacts = props.contacts || {}
  console.log(contacts)
  const [coppyContacts, setCoppyContacts] = useState([]);
  useEffect(() => {
    if (coppyContacts.length === 0) {
      setCoppyContacts([...contacts])
    }
  }, [contacts]);

  const num = props.num || {}

  const showProjectContacts = (projectid) => {
    setContacts(coppyContacts.filter((contact) => {
      return contact.projectid === projectid
    }))

  }

  const getProjects = async () => {
    try {
      console.log(id)
      const res = await axios.get(`http://localhost:2000/api/projects/getProjects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {
        const dataProjects = res.data.map((project) => {
          return project.projectid
        })
        setProjects(dataProjects)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  const deleteProject = async (projectid) => {

    try {
      const res = await axios.delete(`http://localhost:2000/api/projects/deleteProject`,
        { data: { projectid, managerid: id }, headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {
        const projectsData = res.data.map((project) => {
          return project.projectid
        })
        setProjects(projectsData)
        window.location.reload();
      }
    }
    catch (err) {
      console.error(err)
    }
  }
  const addProject = async () => {
    try {
      const res = await axios.post("http://localhost:2000/api/projects/addProject", { name: projectname, managerid: id },
        { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {
        const projectsData = res.data.map((project) => {
          return project.projectid
        }
        )
        setProjects(projectsData)
      }
    }
    catch (err) {
      console.error(err)
    }

  }
  const addTaskToAllClients = () => {
    const formData = new FormData();
    formData.append("title", taskToAllClients.title);
    if(taskToAllClients.description) {
    formData.append("description", taskToAllClients.description);
    }
    formData.append("date", taskToAllClients.date);
    formData.append("managerid", taskToAllClients.managerid);
    formData.append("projectid", taskToAllClients.projectid);
    formData.append("file", taskToAllClients.file);
    try {
      contacts.map(async (contact, index) => {
        if (contact.projectid === taskToAllClients.projectid) {
          
          formData.delete("clientid")
          formData.append("clientid", contact._id);
          const res = await axios.post(`http://localhost:2000/api/tasks/addTask`, formData,
            { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 200) {
            if (index === contacts.length - 1) {
              toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task added to all clients in the group', life: 3000});
              setTaskToAllClients({
                managerid: id,
                projectid: "",
                clientid: "",
                title: "",
                description: "",
                date: "",
                file: {}
              })
            }

          }
        }
      })

    } catch (error) {
      console.error(error)
    }

  }
  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1351);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const confirm = (event, projectid) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Do you want to delete this project?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      accept: (() => { deleteProject(projectid) }),
      reject: () => { }
    });
  };

  useEffect(() => {
    getProjects()
  }, [])

  const items = [
    {
      label: "Users",
      icon: "pi pi-users",
      items: [
        { label: "All Clients", icon: "pi pi-list", command: () => num == 1 ? navigate(0, { state: {  num: 1 } }) : navigate(`/manager/${id}`, { state: {  num: 1 } }) },
        { label: "Add Client", icon: "pi pi-user-plus", command: () => navigate(`/manager/${id}/addUser`, { state: {  num: 2 } }) }
      ]
    },
    {
      label: "Projects",
      items: [
        {
          label: "All Projects",
          icon: isProjectsOpen ? "pi pi-chevron-up" : "pi pi-chevron-down",
          command: toggleProjects
        },
        ...(isProjectsOpen ? projects.map(project => ({
          template: (item, options) => (
            <div className="highlight-div"
            onClick={() => { showProjectContacts(project._id) }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}>
              <span >{`-${project.name}`}</span>
              <ConfirmPopup />

              <i
                className="pi pi-trash"
                style={{ cursor: 'pointer', marginLeft: 'auto' }}
                onClick={(e) => confirm(e, project._id)}
              />

              <Tooltip target=".edit-icon" content="Add a task to the whole group" />
              <i
                className="pi pi-pen-to-square edit-icon"
                style={{ cursor: 'pointer', marginLeft: '5px' }}
                onClick={() => { setShowAddTaskToAllClients(true); setTaskToAllClients({ ...taskToAllClients, projectid: project._id }) }}
              />
             



            </div>
          )
        })) : []),
        { label: "Add Project", icon: "pi pi-plus", command: () => setShow(true) }
      ]

    },
    { label: "Analytics", icon: "pi pi-chart-bar", command: () => navigate(`/manager/${id}/analytics`, { state: {  num: 7} }) },
    { label: "Settings", icon: "pi pi-cog", command: () => navigate(`/manager/${id}/settings`, { state: {  num: 4 } }) },
    { label: "Help", icon: "pi pi-question", command: () => navigate(`/manager/${id}/help`, { state: {  num: 6} }) },

  ];

  return (
    <>
      <div className="app-container">
        <Toast ref={toast} />
        {!isMobile && (
          <div className="sidebar">
            <h2>Menu</h2>
            <Menu model={items} className="w-full" />
          </div>
        )}

        {isMobile && (
          <Button
            icon="pi pi-bars"
            className="p-button-rounded p-button-text mobile-menu-button custom-icon-button"
            onClick={() => setVisible(true)}
          />
        )}

        <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar-md">
          <h2>Menu</h2>
          <Menu model={items} className="w-full" />
        </Sidebar>
      </div>
      <Dialog   
        visible={show}
        modal
        onHide={() => { if (!show) return; setShow(false); }}
        content={({ hide }) => (
          <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
            <h2 style={{textAlign:'center'}}>Add a new project</h2>
            <div className="inline-flex flex-column gap-2">
              <InputText onChange={(e) => setProjectname(e.target.value)} className="input-focus" placeholder="Project Name" id="projectname" label="Projectname" type="text"></InputText>
            </div>
            <div className="flex align-items-center gap-2">
{    projectname?        
  <Button label="Add" onClick={(e) => { hide(e); addProject() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
:  <Button disabled label="Add" onClick={(e) => { hide(e); addProject() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
}       
       <Button label="Cancel" onClick={(e) => hide(e)} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green', }}></Button>
            </div>
          </div>
        )}
      ></Dialog>

      <Dialog
        visible={showAddTaskToAllClients}
        modal
        onHide={() => { if (!showAddTaskToAllClients) return; setShowAddTaskToAllClients(false); }}
        content={({ hide }) => (
          <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
          <h2 style={{textAlign:'center'}}>Add a task to the whole group</h2>

            <div className="inline-flex flex-column gap-2">
              <InputText onChange={(e) => setTaskToAllClients({ ...taskToAllClients, title: e.target.value })} className="input-focus" placeholder="Task Title" id="title" label="Task Title" type="text"></InputText>
            </div>
            <div className="inline-flex flex-column gap-2">
              <InputTextarea onChange={(e) => setTaskToAllClients({ ...taskToAllClients, description: e.target.value })} className="input-focus" placeholder="Description" id="description" label="Description" type="text"></InputTextarea>
            </div>
            <div className="inline-flex flex-column gap-2">
              <Calendar value={taskToAllClients.date} onChange={(e) => setTaskToAllClients({ ...taskToAllClients, date: e.target.value })} placeholder="Date" />
            </div>
            <div className="inline-flex flex-column gap-2 justify-content-center">
              <FileUpload chooseLabel="Upload Files"
                chooseOptions={{ style: { width: '100%', color: "green", background: "white", border: '1px solid green' } }}
                mode="basic" name="demo[]" url="/api/upload" maxFileSize={1000000}
                onSelect={(e) => {
                  const newfile = e.files[0];
                  setTaskToAllClients({ ...taskToAllClients, file: newfile})
              }}
              />
            </div>

            <div className="flex align-items-center gap-2">
 {(taskToAllClients.title && taskToAllClients.date) ?
              <Button label="Add" onClick={(e) => {
                hide(e); addTaskToAllClients()
              }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>:
              <Button disabled label="Add" onClick={(e) => {
                hide(e); addTaskToAllClients()
              }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
              }        
   <Button label="Cancel" onClick={(e) => {hide(e); setTaskToAllClients({
                managerid: id,
                projectid: "",
                clientid: "",
                title: "",
                description: "",
                date: "",
                file: {}
              })}} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green', }}></Button>
            </div>
          </div>
        )}
      ></Dialog>




    </>
  );
}


