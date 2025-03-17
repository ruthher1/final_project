

// import { Button } from "primereact/button"
// import { Card } from "primereact/card"
// import axios from 'axios'
// import React from 'react';
// import { InputText } from "primereact/inputtext"
// import { Dialog } from "primereact/dialog"
// import { useForm } from 'react-hook-form';
// import { useState } from "react"

// const ShowReceiverToOrganizer = (props) => {
//     const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
//     const [visible, setVisible] = useState(false);
//     const token = JSON.parse(localStorage.getItem('token')) || ""
//     const [receiver, setReceiver] = useState({
//         name: props.user.name,
//         userid: props.user.userid,
//         password: props.user.password,
//         phone: props.receiver.phone,
//         email: props.receiver.weight,
//         address: props.receiver.height,
//     })

//     const deleteReceiver = async () => {
//         try {
//             const res = await axios.delete(`http://localhost:2000/api/receivers/deleteReceiver/${props.receiver._id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             if (res.status === 200) {
//                 props.setReceiversData(res.data)
//             }
//         } catch (error) {
//             console.error("Error deleting user:", error);
//         }
//     }
//     const onSubmit = async (data) => {
//        try {
//             const newReceiver = { ...data, id: props.receiver._id }
//                if(!newReceiver.password)
//                 {
//                     newReceiver.password=receiver.password
//                 }
//             const res = await axios.put(`http://localhost:2000/api/receivers/updateReceiver`, newReceiver, {
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//             if (res.status === 200) {
//                 props.setReceiversData(res.data);
//             }
//         } catch (error) {
//             console.error(error)
//             // setKid({...kid,userId: props.user.userId})
//         }
//         setReceiver({name:watch("name"),userid:watch("userid"),password:watch("password"),email:watch("email"),phone:watch("phone"),address:watch("address")})
//         setVisible(false);
//         reset();
//     }
//     return (
//         <>
//             <div className="p-d-flex p-jc-center p-ai-center p-mt-5">
//                 <Card
//                     title={props.user.name}
//                     subTitle={props.user.userId}
//                     // footer={props.kid.age}
//                     // header={props.user.height}
//                     className="p-shadow-4"
//                     style={{ width: '300px', borderRadius: '10px' }}>
//                     <p className="p-m-0" style={{ lineHeight: '1.5' }}>
//                         oo
//                     </p>
//                     <div className="flex flex-wrap justify-content-center align-items-center gap-2">
//                         <Button icon="pi pi-trash" onClick={() => { deleteReceiver() }} className="p-button-danger" label="Delete" style={{ padding: '0.5rem 1rem' }} />
//                         <Button icon="pi pi-pencil" onClick={() => setVisible(true)} className="p-button-primary" label="Edit" style={{ padding: '0.5rem 1rem' }} />
//                         <Button label="SEE MORE" className="p-button-outlined p-button-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }} />
//                     </div>
//                     <div>
//                         {/* <Button label="Add Child" icon="pi pi-external-link" onClick={() => setVisible(true)} /> */}
//                         <Dialog
//                             header="Update Client"
//                             visible={visible}
//                             style={{ width: '400px' }}
//                             modal
//                             onHide={() => setVisible(false)}>
//                             <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
//                                 <div className="field">
//                                     <label htmlFor="name">Full Name</label>
//                                     <InputText id="name" defaultValue={receiver.name}  {...register('name', 
//                                     { required: 'שדה חובה' })} className={errors.name ? 'p-invalid' : ''} />
//                                     {errors.name && <small className="p-error">{errors.name.message}</small>}
//                                 </div>
//                                 <div className="field">
//                                     <label htmlFor="userid">ID</label>
//                                     <InputText id="userid" {...register('userid', { required: 'שדה חובה' })}
//                                         className={errors.userid ? 'p-invalid' : ''}
//                                         defaultValue={receiver.userid}
//                                     />
//                                     {errors.userid && <small className="p-error">{errors.userid.message}</small>}
//                                 </div>

//                                 <div className="field">
//                                     <label htmlFor="password">Password</label>
//                                     <InputText id="password" type="password"  {...register('password', {
//                                         // required: 'שדה חובה',
//                                         minLength: { value: 6, message: 'סיסמה חייבת להיות באורך של לפחות 6 תווים' }
//                                     })}
//                                         className={errors.password ? 'p-invalid' : ''}
//                                     />
//                                     {errors.password && <small className="p-error">{errors.password.message}</small>}
//                                 </div>

//                                 <div className="field">
//                                     <label htmlFor="email">Email</label>
//                                     <InputText id="email" defaultValue={receiver.email}  {...register('email', 
//                                     { required: true,pattern: { value: /^\S+@\S+\.\S+$/, message: 'not correct email' }  })}
//                                         className={errors.email ? 'p-invalid' : ''}
//                                     />
//                                     {errors.email && <small className="p-error">{errors.email.message}</small>}
//                                 </div>

//                                 <div className="field">
//                                     <label htmlFor="phone">Phone</label>
//                                     <InputText id="phone" {...register('phone')} defaultValue={receiver.phone} 
//                                         className={errors.phone ? 'p-invalid' : ''}
//                                     />
//                                     {errors.phone && <small className="p-error">{errors.phone.message}</small>}
//                                 </div>

//                                 <div className="field">
//                                     <label htmlFor="address">Address</label>
//                                     <InputText id="address" {...register('address')} defaultValue={receiver.address} 
//                                         className={errors.address ? 'p-invalid' : ''}
//                                     />
//                                     {errors.address && <small className="p-error">{errors.address.message}</small>}
//                                 </div>
//                                 <div className="p-mt-3">
//                                     <Button type="submit" label="Update" className="p-button-success" />
//                                     <Button type="button" label="Cancle" className="p-button-secondary p-ml-2" onClick={() => setVisible(false)} />
//                                 </div>
//                             </form>
//                         </Dialog>
//                     </div>
//                 </Card>
//             </div>

//         </>
//     )
// }
// export default ShowReceiverToOrganizer