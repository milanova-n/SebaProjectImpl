import {useRef, useContext} from "react";
import {Avatar, Box, IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from "axios";
import {getToken} from "../../utils/tokenService";
import {theme} from "../theme/theme";
import {UserContext} from "../context/UserContext";
import {ErrorContext} from "../context/ErrorContext";

const ImageUpload = ({initials, isEditable}) => {
    const {user, updateUser} = useContext(UserContext);
    const {setErrorMessage} = useContext(ErrorContext);

    const fileUploadRef = useRef();
    const token = getToken();

    const handleDeleteImage = async () => {
        try {
            const deletedUser = await axios.delete(
                "http://localhost:8080/api/users/profilePicture",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            updateUser(deletedUser.data);
        } catch (error) {
            console.log("Error while deleting profile picture: ", error);
            if (error.response) {
                if (error.response.status === 401) {
                    window.location.href = "/noAccess";
                }
            }
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
    };
    const handleImageUpload = () => {
        fileUploadRef.current.click(); //simulate click event on <input>
    };

    const uploadImageDisplay = async (event) => {
        try {
            const uploadedFile = event.target.files[0]; //single type uploader
            const formData = new FormData();
            formData.append("image", uploadedFile);

            const response = await axios.post(
                "http://localhost:8080/api/users/uploadImage",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            updateUser(response.data);
        } catch (error) {
            console.log("Error while uploading profile picture: ", error);
            if (error.response) {
                if (error.response.status === 401) {
                    window.location.href = "/noAccess";
                }
            }
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
    };

    return (
        <Box position="relative" margin={2} sx={{gap: 2, alignItems: "center"}}>
            {user.profilePicture ? (
                <Avatar
                    src={user.profilePicture}
                    sx={{width: 150, height: 150, margin: "auto"}}
                />
            ) : (
                <Avatar sx={{width: 150, height: 150, margin: "auto"}}>
                    {initials}
                </Avatar>
            )}

            {isEditable && (
                <Box
                    position="absolute"
                    bottom={2}
                    right={-6}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                >
                    <IconButton
                        onClick={handleImageUpload}
                        sx={{bgcolor: "rgba(255,255,255,0.7)", borderRadius: "50%"}}
                    >
                        <EditIcon sx={{color: theme.colors.black}}/>
                    </IconButton>
                    <IconButton
                        onClick={handleDeleteImage}
                        sx={{bgcolor: "rgba(255,255,255,0.7)", borderRadius: "50%"}}
                    >
                        <DeleteIcon sx={{color: theme.colors.black}}/>
                    </IconButton>
                </Box>
            )}

            <input
                type="file"
                ref={fileUploadRef} //whenever I call fileUploadRef, I am referencing this <input>
                onChange={uploadImageDisplay}
                style={{display: "none"}}
            />
        </Box>
    );
};

export default ImageUpload;
