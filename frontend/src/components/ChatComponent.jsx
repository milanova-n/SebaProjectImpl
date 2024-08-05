import io from 'socket.io-client';
import {useContext, useEffect, useRef, useState} from 'react';
import {UserContext} from "../context/UserContext.jsx";
import {Avatar, Button, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { ErrorContext } from "../context/ErrorContext.jsx";

const SOCKET_SERVER_URL = "http://localhost:8080";

const ChatComponent = ({ eventId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { setErrorMessage } = useContext(ErrorContext);

    const {user} = useContext(UserContext);

    const [socket, setSocket] = useState();

    useEffect(() => {

        const newSocket = io(SOCKET_SERVER_URL, {query: {"eventId": eventId}});
        setSocket(newSocket);

        const fetchMessages = async () => {
            try {
                console.log('fetching messages')
                const response = await fetch(`${SOCKET_SERVER_URL}/api/messages/${eventId}`);
                if (!response.ok) {
                    console.error('Response not OK:', await response.text());
                    return;
                }
                console.log("fetched message: ")
                const data = await response.json();
                console.log(data)
                setMessages(data);
            } catch (error) {
        console.error("Error fetching messages:", error);
        const errorMessage = error?.response?.data?.message || "Unknown";
        setErrorMessage(errorMessage);
        window.location.href = "/error";
      }
        };



        newSocket.on('connect', () => {
            console.log('Connected to chat server');
            newSocket.emit('joinRoom', { chatRoomId: eventId});
            fetchMessages()
        });


        newSocket.on('message', (message) => {
            console.log(message)
            setMessages((prevMessages) => [...prevMessages, message]);
            fetchMessages()
            scrollToBottom();
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        console.log('user')
        console.log(user.firstName)
        console.log(user._id)

        return () => {
            console.log('disconnecting')
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;
        console.log("user id: " + user.firstName)
        socket.emit('chatMessage', { chatRoomId: eventId, message: input, userId: user._id});

        setInput('');
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault(); // Prevents the default action of the enter key which is to submit a form or create a new line in some contexts.
        }
    };

    return (

        <Box sx={{ width: '100%', maxWidth: '900px'}}>
            <Box

                sx={{
                    height: '400px',
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px'
                }}
            >


                {messages.map((msg, index) => (
                    <Box key={index}
                         sx={{
                             display: 'flex',
                             flexDirection: msg.sender && msg.sender._id === user._id ? 'row-reverse' : 'row',
                             justifyContent: 'flex-start',
                             margin: '10px 0'
                         }}>
                        <Avatar src={msg.sender && msg.sender.profilePicture ? msg.sender.profilePicture : '/default-profile.png'}
                                sx={{ alignSelf: 'center', marginLeft: msg.sender && msg.sender._id === user._id ? '10px' : '0', marginRight: msg.sender && msg.sender._id === user._id ? '0' : '10px' }} />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems:'flex-start',
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: msg.sender && msg.sender._id === user._id ? '#1976d2' : '#ECECEC',
                                maxWidth: '100%',
                            }}>
                            {msg.sender && msg.sender._id !== user._id && (
                                <strong style={{
                                    color: 'black',
                                    marginRight: '5px',
                                    whiteSpace: 'nowrap',
                                    alignSelf: 'flex-start',
                                }}>
                                    {msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName}` : 'Unknown'}
                                </strong>
                            )}

                            <span style={{color: msg.sender._id === user._id ? 'white' : 'black' }}>{msg.content}</span>
                            <div style={{
                                fontSize: '0.65rem',
                                fontStyle: 'italic',
                                alignSelf: 'flex-end',
                                marginTop: '1px',
                                color: msg.sender._id === user._id ? 'white' : 'black',
                            }}>
                                {new Date(msg.createdAt).toLocaleString('en-GB', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}
                            </div>
                        </Box>
                    </Box>
                ))}

                <div ref={messagesEndRef}></div>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    sx={{ marginRight: '10px', flexGrow: 1 }}
                    onKeyPress={handleKeyPress}
                />
                <Button variant="contained" onClick={sendMessage}>Send</Button>
            </Box>
        </Box>

    );
};

ChatComponent.propTypes = {
    eventId: PropTypes.string,
};

export default ChatComponent;