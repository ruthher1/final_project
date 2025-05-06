
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toast } from 'primereact/toast';
import { useRef } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Help=()=> {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
      const res=await axios.post('http://localhost:2000/api/email/send-email', {
        name,
        email,
        message
      });
      if (res.status === 200){
              toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message sent successfully!', life: 3000 });
              setName('');
              setEmail('');
              setMessage('');
      } 
    } catch (err) {
      // alert('Failed to send: ' + err.response?.data?.error || err.message);
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.error || err.message, life: 3000 });
    }finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      style={{
        margin: '5% ',
        marginTop: '7%',
        padding: '30px',
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#f5fdfc',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0, 128, 128, 0.1)',
      }}
    >
      <Toast ref={toast} />
      <section style={{ 
        marginBottom: '40px', textAlign: 'left' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#006d77',
            marginBottom: '20px',
          }}
        >
          Welcome to the Task Management System!
        </h1>
        <p style={{ fontSize: '18px', color: '#333' }}>
          This platform is designed to enhance organization, efficiency, and
          communication with your clients. Here's a more detailed breakdown of
          what the system offers and how it benefits you and your clients.
        </p>
      </section>

      <Section title="Key Features">
        <ul>
          <li>
            <strong>Client Management:</strong> Manage, edit, and track all
            client profiles and progress.
          </li>
          <li>
            <strong>Task Assignment:</strong> Create and assign daily tasks with
            clear instructions and deadlines.
          </li>
          <li>
            <strong>Progress Tracking:</strong> Monitor completed and pending
            tasks in real-time.
          </li>
          <li>
            <strong>Communication:</strong> Directly message clients for
            feedback and guidance.
          </li>
        </ul>
      </Section>

      <Section title="How Clients Benefit">
        <ul>
          <li>
            <strong>Task Tracking:</strong> Clients can view, track, and mark
            tasks as complete.
          </li>
          <li>
            <strong>Direct Communication:</strong> Built-in messaging for
            questions and feedback.
          </li>
          <li>
            <strong>Engagement and Accountability:</strong> Clients stay
            motivated and on track.
          </li>
        </ul>
      </Section>

      <Section title="How the System Helps You">
        <ul>
          <li>
            <strong>Increased Efficiency:</strong> Save time with streamlined
            task management and communication.
          </li>
          <li>
            <strong>Better Organization:</strong> Keep everything in one
            place—tasks, profiles, and progress.
          </li>
          <li>
            <strong>Improved Client Outcomes:</strong> Clear tasking and
            real-time tracking lead to better results.
          </li>
        </ul>
      </Section>

      <Section title="Support">
        <p>
          If you encounter any issues or have specific requests, you can easily
          leave a message through the platform. Our support team will assist
          you.
        </p>
      </Section>

      <section
        style={{
          marginTop: '50px',
          padding: '20px',
          backgroundColor: '#e0f7f6',
          borderRadius: '8px',
          textAlign: 'left',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#004f4f',
            marginBottom: '15px',
            display: 'flex',
    alignItems: 'center',
    gap: '10px'
          }}
        >
          Leave a Message
          {loading && (
  <div style={{ margin: "20px" }}>
    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="5" />
  </div>
)}
        </h2>
        <form onSubmit={onSubmit}  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input required type="text" placeholder="Your Name" style={inputStyle} value={name} onChange={e => setName(e.target.value)}/>
          <input required type="email" placeholder="Your Email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)}/>
          <textarea
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Write your message here..."
            style={{ ...inputStyle, minHeight: '120px' }}
          ></textarea>
          <input required type="submit" style={{padding: '12px',
                                       backgroundColor: '#009688',
                                       color: 'white',
                                       border: 'none',
                                       borderRadius: '6px',
                                       fontSize: '16px',
                                       cursor: 'pointer',}} value={"Send Message"} />
        
        </form>
      </section>
    </div>
  );
}

const inputStyle = {
  padding: '12px',
  border: '1px solid #b2dfdb',
  borderRadius: '6px',
  fontSize: '16px',
  backgroundColor: '#ffffff',
};



function Section({ title, children }) {
  return (
    <section
      style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#e6f2f2',
        borderRadius: '8px',
        textAlign: 'left',
      }}
    >
      <h2
        style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#006d77',
          marginBottom: '12px',
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: '16px', color: '#333' }}>{children}</div>
    </section>
  );
}
export default Help;