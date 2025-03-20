"use client";
import axios from "axios"
import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Header from './Header';
// import getContacts from './Body';
import { useLocation, useNavigate } from "react-router-dom";

export default function Aaa(props) {

  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projects, setProjects] = useState([])
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [projectname, setProjectname] = useState("")
  const location = useLocation();
  const id = props.id || {}
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const navigate = useNavigate()
  const setContacts = props.setContacts || {}
  const num=props.num||{}
  const showProjectContacts = async (projectid) => {
    try {
      const res = await axios.get(`http://localhost:2000/api/users/getProjectClients/${projectid}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {
        const dataClients = res.data.map(client => { return { ...client.clientid, project: client.projectid.name, projectid: client.projectid._id } })
        setContacts(dataClients)

      }
    } catch (err) {
      console.error(err)
    }
  }

  const getProjects = async () => {
    try {
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

  useEffect(() => {
    getProjects()
  }, [])

  const items = [
    { label: "Dashboard", icon: "pi pi-home", command: () => console.log("Dashboard Clicked") },
    {
      label: "Users",
      icon: "pi pi-users",
      items: [
        { label: "All Clients", icon: "pi pi-list", command: () => num==1?navigate(0,{ state: {id,num:1}}): navigate(`/manager/${id}`, { state: {id,num:1} }) } ,
        { label: "Add Client", icon: "pi pi-user-plus", command: () => navigate(`/manager/${id}/addUser`, { state: {id,num:2}})} 
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
            <div onClick={() => { showProjectContacts(project._id) }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}>
              <span >{`-${project.name}`}</span>
              <i
                className="pi pi-trash"
                style={{ cursor: 'pointer', marginLeft: 'auto' }}
                onClick={() => deleteProject(project._id)}
              />
            </div>
          )
        })) : []),
        { label: "Add Project", icon: "pi pi-plus", command: () => setShow(true) }
      ]

    },
    { label: "Analytics", icon: "pi pi-chart-bar", command: () => console.log("Analytics Clicked") },
    { label: "Settings", icon: "pi pi-cog", command: () => navigate(`/manager/${id}/settings`, { state: {id,num:4} })},
    { label: "Help", icon: "pi pi-question", command: () => console.log("Help Clicked") },

  ];

  return (
    <>
      <div className="app-container">
        {/* Sidebar קבוע במסכים גדולים */}
        {!isMobile && (
          <div className="sidebar">
            <h2>Menu</h2>
            <Menu model={items} className="w-full" />
          </div>
        )}

        {/* כפתור לפתיחת ה-Sidebar במסכים קטנים */}
        {isMobile && (
          <Button
            icon="pi pi-bars"
            className="p-button-rounded p-button-text mobile-menu-button custom-icon-button"
            onClick={() => setVisible(true)}
          />
        )}

        {/* Sidebar במסכים קטנים */}
        <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar-md">
          <h2>Menu</h2>
          <Menu model={items} className="w-full" />
        </Sidebar>

        <Dialog
          visible={show}
          modal
          onHide={() => { if (!show) return; setShow(false); }}
          content={({ hide }) => (
            <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
              <div className="inline-flex flex-column gap-2">
                <InputText onChange={(e) => setProjectname(e.target.value)} className="input-focus" placeholder="Project Name" id="projectname" label="Projectname" type="text"></InputText>
              </div>
              <div className="flex align-items-center gap-2">
                <Button label="Add" onClick={(e) => { hide(e); addProject() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
                <Button label="Cancel" onClick={(e) => hide(e)} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green', }}></Button>
              </div>
            </div>
          )}
        ></Dialog>
      </div></>
  );
}


