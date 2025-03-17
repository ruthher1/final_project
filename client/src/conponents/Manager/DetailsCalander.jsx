import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea'
import axios from "axios"
import { FileUpload } from 'primereact/fileupload'
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const DetailsCalander = (props) => {
    const id = props.id || {}
    const rowData = props.rowData || {}
    const [date, setDate] = useState(new Date());
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [tasks, setTasks] = useState([]);
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const [task, setTask] = useState({
        title: "",
        description: "",
        managerid: id,
        projectid: rowData.projectid,
        clientid: rowData._id,
        amount: "",
        date: null,
        _id: null
    });
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
        try {

            const res = await axios.post(`http://localhost:2000/api/tasks/addTask`, task,
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

    const deleteTask = async (taskid) => {
        try {
            const res = await axios.delete(`http://localhost:2000/api/tasks/deleteTask/${taskid}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const tasksData = res.data.map((task) => { return task })
                setTasks(tasksData)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const editTask = async () => {
        try {
            const res = await axios.put(`http://localhost:2000/api/tasks/updateTask`, { ...task, id: task._id },
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
            <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "60px", alignItems: "center", marginTop: "40px" }}>
                <h1 >Client:  {rowData.name}</h1>
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
                    <table> {/* שימוש בטבלה */}
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
                                                        <i
                                                            className="pi pi-trash"
                                                            style={{ marginRight: "5px", cursor: "pointer" }}
                                                            onClick={() => deleteTask(t._id)}
                                                        />
                                                        <i
                                                            className="pi pi-pencil"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                setShowEdit(true);
                                                                setTask(t);
                                                            }}
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
                            {/* <InputText onChange={(e) => setTask({ ...task, description: e.target.value })} className="input-focus" placeholder="Description" label="Description" type="text"></InputText> */}
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <InputText onChange={(e) => setTask({ ...task, amount: e.target.value })} className="input-focus" placeholder="Amount" label="Amount" type="text" required></InputText>
                        </div>
                        <div className="card flex justify-content-center">
                            {/* <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" customUpload uploadHandler={customBase64Uploader} /> */}
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
                            <InputText value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} className="input-focus" placeholder="Task Name" label="TaskName" type="text" required></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <InputTextarea value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} rows={5} cols={30} placeholder='Description' className="input-focus" />
                            {/* <InputText onChange={(e) => setTask({ ...task, description: e.target.value })} className="input-focus" placeholder="Description" label="Description" type="text"></InputText> */}
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <InputText value={task.amount} onChange={(e) => setTask({ ...task, amount: e.target.value })} className="input-focus" placeholder="Amount" label="Amount" type="text" required></InputText>
                        </div>
                        <div className="card flex justify-content-center">
                            {/* <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" customUpload uploadHandler={customBase64Uploader} /> */}
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Update" onClick={(e) => { hide(e); editTask() }} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green' }}></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} className="w-full input-focus" style={{ color: "green", background: "white", border: '1px solid green', }}></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
        </>
    );
};


export default DetailsCalander;