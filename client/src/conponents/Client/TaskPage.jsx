import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios"
import io from 'socket.io-client';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";

const TaskPage = (props) => {
    const client = props.client || {}
    const [selectedDate, setSelectedDate] = useState(new Date());
    const token = JSON.parse(localStorage.getItem('token')) || ""
    // const id = props.id || {}
    const id=useSelector(x=>x.Id.id)
    
    const managers = props.managers || {}
    const tasks = props.tasks || {}
    const setTasks = props.setTasks || {}
    const today = new Date().toDateString();
    const isToday = new Date(selectedDate.toDateString()) >= new Date(today);
    const [visible, setVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showCompleted, setShowCompleted] = useState(false)
    const [visibleOptions, setVisibleOptions] = useState(false)
    const [taskCompleted, setTaskCompleted] = useState({})
    const socket = io('http://localhost:2000');
    const messagesEndRef = useRef(null)
    const [selectedManager, setSelectedManager] = useState({ managerid: { name: '' } })

    useEffect(() => {
        const socket = io('http://localhost:2000');
        socket.on('previousMessages', (msgs) => {
            setMessages(msgs.filter((message) => { return (message.senderId === id && message.receiverId === selectedManager.managerid._id) || (message.senderId === selectedManager.managerid._id && message.receiverId === id) }));
        });

        socket.on('newMessage', (message) => {
            if ((message.senderId === id && message.receiverId === selectedManager.managerid._id) || (message.senderId === selectedManager.managerid._id && message.receiverId === id)) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
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
                sender: client.name,
                senderId: id,
                receiverId: selectedManager.managerid._id,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.emit('sendMessage', message);
            setNewMessage('');
        }
    };
    const printFile = () => {
        const printWindow = window.open("URL_TO_YOUR_FILE", "_blank"); // פותח את הקובץ בלשונית חדשה
        printWindow.onload = () => {
            printWindow.print(); // מתחיל את פעולת ההדפסה
        };
    };

    const updateTask = async (task = taskCompleted) => {
        try {
            console.log(taskCompleted._id)
            const res = await axios.put(`http://localhost:2000/api/tasks/completeTask`, { ...task, id: task._id, clientid: id },
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setTasks(res.data.map((newtask) => { return { ...newtask, managername: newtask.connectionid.managerid.name,projectname:newtask.connectionid.projectid.name } }));
                setTaskCompleted({})
            }
        }
        catch (err) {
            console.error(err)
        }
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-IL', options);
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen ">
                <div className="max-w-6xl mx-auto " >
                    <div className="mb-6 font-bold text-xl text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Tasks</h1>
                        <p className="text-gray-500">Hi {client.name}, here are your tasks for today 👇</p>
                    </div>

                    <div className="flex justify-between items-center mb-5">
                        <Button
                            icon="pi pi-chevron-left"
                            className="p-button-text p-button-rounded "
                            onClick={() =>
                                setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
                            }
                        />
                        <h2 className="text-xl font-semibold text-gray-700 ">
                            {formatDate(selectedDate)}
                        </h2>
                        <Button
                            icon="pi pi-chevron-right"
                            className="p-button-text p-button-rounded"
                            onClick={() =>
                                setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
                            }
                        />
                    </div>

                    <div className="shadow-md rounded-lg bg-white p-4">
                        <DataTable value={tasks.filter((task) => {
                            const taskDate = new Date(task.date)
                            return (
                                taskDate.getFullYear() === selectedDate.getFullYear() &&
                                taskDate.getMonth() === selectedDate.getMonth() &&
                                taskDate.getDate() === selectedDate.getDate()
                            );
                        })}
                            stripedRows
                            responsiveLayout="scroll"
                            className="p-datatable-gridlines">
                            <Column field="managername" header="Manager" style={{ minWidth: '120px' }} />
                            <Column field="projectname" header="Project" style={{ minWidth: '120px' }} />
                            <Column field="title" header="Task" style={{ minWidth: '200px' }} />
                            <Column field="description" header="Description" body={(rowData) => rowData.description ? rowData.description : <>No Description</>} />
                            <Column header="File"
                                body={(rowData) => rowData.file ? (

                                    <div className="flex items-center gap-3">
                                        <i className="pi pi-file" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                                        <div className="flex-1">
                                            <h4 className="m-0">{rowData.file?.fileName}</h4>
                                            <a href={rowData.file?.filePath} download>
                                                <Button icon="pi pi-download" className="p-button-sm p-button-text"  />
                                            </a>
                                            <Button
                                                icon="pi pi-external-link"
                                                className="p-button-sm p-button-text"
                                                // onClick={() => window.open(rowData.file?.filePath, '_blank')}
                                                onClick={() => window.open(`http://localhost:2000/${rowData.file?.filePath}`, '_blank')}

                                            />
                                            <Button
                                                icon="pi pi-print"
                                                className="p-button-sm p-button-text"
                                                onClick={() => {
                                                    // const printWindow = window.open(rowData.file?.filePath, '_blank');
                                                    const printWindow = window.open(`http://localhost:2000/${rowData.file?.filePath}`, '_blank')

                                                    if (printWindow) {
                                                        printWindow.focus();
                                                        printWindow.onload = () => {
                                                            printWindow.print();
                                                        };
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (<>No File</>)}
                            />
                            <Column
                                header="Completed"
                                body={(rowData) => (
                                    <Checkbox
                                        checked={rowData.completed}
                                        onChange={(e) => {
                                            const task = { ...rowData, comment: "", difficulty: "", completed: e.checked }
                                            setTaskCompleted(task);
                                            e.checked ? setShowCompleted(true) : updateTask(task)

                                        }}
                                        disabled={!isToday}
                                    />
                                )}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>

            <Button
                icon="pi pi-comment"
                className="p-button-rounded p-button-text p-button-secondary custom-icon-button"
                onClick={() => { setVisibleOptions(true) }}

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
                header={`Chat With ${selectedManager.managerid.name}`}
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
                                backgroundColor: msg.sender === client.name ? '#dcdcdc' : '#f5f5f5',
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
                        placeholder="Type Your Message..."
                        style={{ flex: '1', marginRight: '10px' }}
                    />
                    <Button label="Send" onClick={sendMessage} />
                </div>
                {/* </Card> */}
            </Dialog>

            <Dialog
                header="Pick a manager"
                visible={visibleOptions}
                position="bottom-right"
                style={{ width: '350px', height: '60vh', bottom: '60px' }}
                onHide={() => setVisibleOptions(false)}
                draggable={false}
                resizable={false}
            >
                <ScrollPanel style={{ flex: '1', overflowY: 'auto', marginBottom: '10px' }}>
                    {managers.map((manager, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <div onClick={() => { setVisibleOptions(false); setSelectedManager(manager); setVisible(true) }} style={{
                                padding: "5%",
                                backgroundColor: '#f5f5f5',
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}>
                                 {`${manager.managerid.name}-${manager.projectid.name}`}

                            </div>
                        </div>
                    ))}
                </ScrollPanel>

            </Dialog>





            <Dialog
                visible={showCompleted}
                modal
                onHide={() => { if (!showCompleted) return; setShowCompleted(false); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
                     <h2 style={{textAlign:'center'}}>Do you want to respond?</h2>

                        <div className="inline-flex flex-column gap-2">
                            <Dropdown
                                style={{ textAlign: 'left' }}
                                value={taskCompleted.difficulty}
                                onChange={(e) => { setTaskCompleted({ ...taskCompleted, difficulty: e.value }) }}
                                options={["easy", "medium", "hard"]}
                                placeholder="Rating"
                                className="w-full" />
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <InputTextarea placeholder="write your comment hear...." value={taskCompleted.comment} disabled={!isToday} onChange={(e) => setTaskCompleted({ ...taskCompleted, comment: e.target.value })} />
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Send" onClick={(e) => { hide(e); updateTask() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
                            <Button label="No" onClick={(e) => { hide(e); setTaskCompleted({}); updateTask() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green', }}></Button>
                        </div>
                    </div>
                )}
            ></Dialog>

        </>

    );
};

export default TaskPage;