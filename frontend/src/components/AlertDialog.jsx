import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton, Stack,
    Typography,
} from "@mui/material";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {theme} from "../theme/theme";
import CloseIcon from "@mui/icons-material/Close";
import {useEffect, useState} from "react";

const AlertDialog = ({type, open, onClose}) => {

    const [alertMessage, setAlertMessage] = useState("");
    const [button1Message, setButton1Message] = useState("");
    const [button2Message, setButton2Message] = useState("");
    const [button1Link, setButton1Link] = useState("");
    const [button2Link, setButton2Link] = useState("");
    const [disable2ndButton, setDisable2ndButton] = useState(false);


    useEffect(() => {
        const contentDecider = async () => {
            if (type === "registration") {
                setAlertMessage("More details are only \n visible for members! 🚨");
                setButton1Message("Create Account");
                setButton2Message("Login");
                setButton1Link("/register");
                setButton2Link("/LogIn");
            }else if (type === "registrationSubmit") {
                setAlertMessage("You need to be a member \n to submit an event! 🚨");
                setButton1Message("Create Account");
                setButton2Message("Login");
                setButton1Link("/register");
                setButton2Link("/LogIn");
            } else if (type === "subscription") {
                setAlertMessage("You need to be a subscriber \n to buy tickets! 🚨");
                setButton1Message("Subscribe");
                setButton1Link("/subscribe");
                setDisable2ndButton(true);
            }
        }
        contentDecider()
    }, []);

    return (
        <Dialog open={open} onClose={onClose}>
            <Stack direction={"column"} alignItems={"center"} padding={"5vh"} sx={{backgroundColor: theme.colors.blue, p: "8px 8px"}}>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon sx={{color: theme.colors.white}}/>
                </IconButton>
                <DialogContent>
                    <Typography
                        sx={{color: theme.colors.white, padding: "12px 8px 0px 8px"}}
                    >
                        {alertMessage}
                    </Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        backgroundColor: theme.colors.blue,
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction={"row"} spacing={4}>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                backgroundColor: theme.colors.white,
                                "&:hover": {
                                    backgroundColor: theme.colors.white,
                                },
                            }}
                        >
                            <Link
                                to={button1Link}
                                style={{
                                    textDecoration: "none",
                                    color: theme.colors.blue,
                                }}
                            >
                                {button1Message}
                            </Link>
                        </Button>
                        {!disable2ndButton &&
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    backgroundColor: theme.colors.white,
                                    "&:hover": {
                                        backgroundColor: theme.colors.white,
                                    },
                                }}
                            >
                                <Link
                                    to={button2Link}
                                    style={{textDecoration: "none", color: theme.colors.blue}}
                                >
                                    {button2Message}
                                </Link>
                            </Button>
                        }
                    </Stack>
                </DialogActions>
            </Stack>
        </Dialog>
    );
};

AlertDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    type: PropTypes.string,
};

export default AlertDialog;
