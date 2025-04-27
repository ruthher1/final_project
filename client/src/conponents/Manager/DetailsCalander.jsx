import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { InputTextarea } from 'primereact/inputtextarea'
import axios from "axios"
import { FileUpload } from 'primereact/fileupload'
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import io from 'socket.io-client';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Message } from 'primereact/message';
import DetailsTask from './DetailsTask';
import { useSelector } from 'react-redux';


const DetailsCalander = (props) => {
    // const contacts = props.contacts || {}
    // console.log(contacts)
    // const id = props.id || {}
     const id=useSelector(x=>x.Id.id)
    
    const rowData = props.rowData || {}
    const [date, setDate] = useState(new Date());
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [tasks, setTasks] = useState([]);
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const toast = useRef(null);
    const menuLeft = useRef(null);
    const [visible, setVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const manager = props.manager || {}
    const setManager = props.setManager || {}
    const [showDetails, setShowDetails] = useState(false)
    const items = [
        {
            items: [
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    command: () => deleteTask(selectedTask._id)
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-pencil',
                    command: () => { setShowEdit(true); }
                },
                {
                    label: 'Details',
                    icon: 'pi pi-eye',
                    command: () => setShowDetails(true)

                },
            ]
        }
    ];

    const [task, setTask] = useState({
        managerid: id,
        projectid: rowData.projectid,
        clientid: rowData._id,
    });

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    // const toastFile = useRef(null);
    const messagesEndRef = useRef(null)
    const socket = io('http://localhost:2000');

    // const onUpload = () => {
    //     toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    // };


    useEffect(() => {
        const socket = io('http://localhost:2000');

        socket.on('previousMessages', (msgs) => {
            setMessages(msgs.filter((msg) => { return (msg.senderId === id && msg.receiverId === rowData._id) || (msg.senderId === rowData._id && msg.receiverId === id) }));
        });

        socket.on('newMessage', (message) => {
            if ((message.senderId === id && message.receiverId === rowData._id) || (message.senderId === rowData._id && message.receiverId === id)) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        socket.on('connect_timeout', (timeout) => {
            console.error('Socket connection timeout:', timeout);
        });

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });

        return () => {
            socket.disconnect();
        };
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    }, [visible]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const message = {
                sender: manager.name,
                senderId: id,
                receiverId: rowData._id,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.emit('sendMessage', message)
            setNewMessage('');
        }
    };

    const getTasks = async () => {

        try {
            const res = await axios.get(`http://localhost:2000/api/tasks/getTasksClient/${id}/${rowData.projectid}/${rowData._id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const tasksData = res.data.map((task) => { return task })
                setTasks(tasksData)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getTasks()
    }, [])

    const getWeekRange = (date) => {
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - date.getDay());
        const endDate = new Date(date);
        endDate.setDate(date.getDate() + (6 - date.getDay()));
        return { startDate, endDate };
    };

    const dateFormat = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const myFormat = (date) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month, day)
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() - 7);
        setDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + 7);
        setDate(newDate);
    };

    const weekRange = getWeekRange(date);

    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(weekRange.startDate);
        currentDay.setDate(weekRange.startDate.getDate() + i);
        daysOfWeek.push(currentDay);
    }

    const addTask = async () => {
        const formData = new FormData();
        formData.append("title", task.title);
        formData.append("date", task.date);
        formData.append("managerid", task.managerid);
        formData.append("clientid", task.clientid);
        formData.append("projectid", task.projectid);
        if(task.description) {
        formData.append("description", task.description);
        }
        formData.append("file", task.file);
        try {
             const res = await axios.post(`http://localhost:2000/api/tasks/addTask`, formData,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setTasks(res.data)
                setTask({
                    title: "",
                    description: "",
                    managerid: id,
                    projectid: rowData.projectid,
                    clientid: rowData._id,
                    date: null,
                    _id: null,
                    file: {},
                })
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const deleteTask = async (taskid) => {
        try {
            const res = await axios.delete(`http://localhost:2000/api/tasks/deleteTask/${taskid}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                // const tasksData = res.data.map((task) => { return task })
                setTasks(res.data)

            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const editTask = async () => {
        const formData = new FormData();
        formData.append("title", selectedTask.title);
        formData.append("file", selectedTask.file);
        formData.append("id", selectedTask._id);
        if(selectedTask.description) {
        formData.append("description", selectedTask.description);
        }
        try {
            const res = await axios.put(`http://localhost:2000/api/tasks/updateTask`, formData,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const dataTasks = res.data.map((task) => { return task })
                setTasks(dataTasks)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    return (

        <>
            <Toast ref={toast}></Toast>
            <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
            <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "60px", alignItems: "center", marginTop: "40px" }}>
                <h1 >Client:  {rowData.name ? rowData.name.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ') : ""}</h1>
            </div>
            <div className="calendar-container" style={{ marginTop: "0px" }}>
                <Card className="weekly-calendar">
                    <div className="flex justify-content-between mb-3">
                        <button className="p-button p-button-rounded p-button-secondary" onClick={goToPreviousWeek}>
                            <i className="pi pi-chevron-left"></i>
                        </button>
                        <div className="font-bold text-xl">
                            {dateFormat(weekRange.startDate)} - {dateFormat(weekRange.endDate)}
                        </div>
                        <button className="p-button p-button-rounded p-button-secondary" onClick={goToNextWeek}>
                            <i className="pi pi-chevron-right"></i>
                        </button>
                    </div>
                    <table> 
                        <thead>
                            <tr>
                                {daysOfWeek.map((day) => (
                                    <th key={day.getTime()}>
                                        <div>{new Intl.DateTimeFormat('en-IL', { weekday: 'long' }).format(day)}</div>
                                        <div>{dateFormat(day)}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>

                            {/* כאן תוכל להוסיף שורות נוספות לתוכן של כל יום */}
                            <tr>
                                {daysOfWeek.map((day) => {
                                    const filteredTasks = tasks.filter((ta) => {
                                        // console.log("aaa" + dateFormat(new Date(ta.date)))
                                        return dateFormat(new Date(ta.date)) === dateFormat(day)

                                    })
                                    return (

                                        <td key={day.getTime()} className="day-cell">
                                            {filteredTasks.map((t) => (
                                                <div
                                                    key={t._id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        margin: "10px",
                                                        padding: "5px",
                                                        borderBottom: "1px solid #eee",
                                                    }}
                                                >
                                                    <span style={{ marginRight: "10px", flex: "1" }}>{t.title}</span>
                                                    <div>


                                                        {
                                                            t.completed === false ?
                                                                <i
                                                                    className="pi pi-stop"
                                                                    style={{ marginLeft: "5px", cursor: "pointer" }}
                                                                /> :
                                                                <i
                                                                    className="pi pi-check-square"
                                                                    style={{ marginLeft: "5px", cursor: "pointer" }}
                                                                />
                                                        }
                                                        <i
                                                            className="pi pi-ellipsis-v"
                                                            style={{ marginRight: "5px", cursor: "pointer" }}
                                                            onClick={(event) => { setShowDetails(false); menuLeft.current.toggle(event); setSelectedTask({ ...t }); }}
                                                        />

                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    );
                                })}
                            </tr>

                            <tr>
                                {daysOfWeek.map((day) => (
                                    <td key={day.getTime()} className="day-cell">
                                        <Button label="Add Task" onClick={() => {
                                            setShowAdd(true);
                                            ; setTask({ ...task, date: myFormat(day) })
                                        }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
            <Dialog
                visible={showAdd}
                modal
                onHide={() => { if (!showAdd) return; setShowAdd(false); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
                        <div className="inline-flex flex-column gap-2">
                            <InputText onChange={(e) => setTask({ ...task, title: e.target.value })} className="input-focus" placeholder="Task Name" label="TaskName" type="text" required></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <InputTextarea onChange={(e) => setTask({ ...task, description: e.target.value })} rows={5} cols={30} placeholder='Description' className="input-focus" />
                        </div>
                        <div className="inline-flex flex-column gap-2 justify-content-center">
                            <FileUpload chooseLabel="Upload Files"
                                chooseOptions={{ style: { width: '100%', color: "green", background: "white", border: '1px solid green' } }}
                                mode="basic" name="demo[]" url="/api/upload" maxFileSize={1000000}
                                onSelect={(e) => {
                                    const newfile = e.files[0];
                                    setTask({ ...task, file: newfile})
                                }}
                            />
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Add" onClick={(e) => { hide(e); addTask() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green', }}></Button>
                        </div>
                    </div>
                )}
            ></Dialog>

            <Dialog
                visible={showEdit}
                modal
                onHide={() => { if (!showEdit) return; setShowEdit(false); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>

                        <div className="inline-flex flex-column gap-2">
                            <InputText value={selectedTask.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} className="input-focus" placeholder="Task Name" label="TaskName" type="text" required></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <InputTextarea value={selectedTask.description} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} rows={5} cols={30} placeholder='Description' className="input-focus" />
                        </div>
                        <div className="inline-flex flex-column gap-2 justify-content-center">
                            {selectedTask.file && (
                                <div className="flex items-center gap-2 mt-3 p-2 border rounded-md bg-gray-50">
                                    <i className="pi pi-file" style={{ fontSize: '1.5rem' }}></i>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{selectedTask.file.fileName}</span>
                                    </div>
                                    <Button
                                        icon="pi pi-external-link"
                                        text
                                        // onClick={() => window.open(selectedTask.file.filePath, "_blank")}
                                        onClick={() => window.open(`http://localhost:2000/${selectedTask.file.filePath}`, '_blank')}

                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        text
                                        severity="danger"
                                        onClick={() => setSelectedTask({ ...selectedTask, file: null })}
                                    />
                                </div>
                            )}

                            <FileUpload
                                mode="basic"
                                chooseLabel="upload new file"
                                name="demo[]"
                                url="/api/upload"
                                maxFileSize={1000000}
                                chooseOptions={{
                                    style: {
                                        width: '100%',
                                        color: "green",
                                        background: "white",
                                        border: '1px solid green'
                                    }
                                }}
                                onSelect={(e) => {
                                    const newfile = e.files[0];
                                    setSelectedTask({
                                        ...selectedTask,
                                        file: newfile
                                    });
                                }}
                               
                            />
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Update" onClick={(e) => { hide(e); editTask() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green', }}></Button>
                        </div>
                    </div>
                )}
            ></Dialog>


            <Button
                icon="pi pi-comment"
                className="p-button-rounded p-button-text p-button-secondary custom-icon-button"
                onClick={() => { setVisible(true) }}
                style={{
                    zIndex: 9999,
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    border: '2px solid rgb(13, 124, 26)',
                    backgroundColor: '#f0f0f0',
                    color: 'rgb(13, 124, 26)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />
            <Dialog
                header={`Chat With ${rowData.name}`}
                visible={visible}
                position="bottom-right"
                style={{ width: '350px', height: '60vh', bottom: '60px' }}
                onHide={() => setVisible(false)}
                draggable={false}
                resizable={false}
            >
                <ScrollPanel style={{ flex: '1', overflowY: 'auto', marginBottom: '10px' }}>
                    {messages.map((msg, index) => (

                        <div key={index} style={{ marginBottom: '10px' }}>
                            {msg.timestamp}
                            <div style={{
                                padding: "5%",
                                backgroundColor: msg.sender === manager.name ? '#dcdcdc' : '#f5f5f5',
                                borderRadius: "5px"
                            }}>
                                {`${msg.sender}: ${msg.content}`}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </ScrollPanel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InputText
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your Message..."
                        style={{ flex: '1', marginRight: '10px' }}
                    />
                    <Button label="Send" onClick={sendMessage} />
                </div>
                {/* </Card> */}
            </Dialog>
            <div className="card">
                {showDetails && <DetailsTask selectedTask={selectedTask} setShowDetails={setShowDetails} />}

            </div>


        </>
    );
};


export default DetailsCalander;