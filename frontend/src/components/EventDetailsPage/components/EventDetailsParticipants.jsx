import PropTypes from "prop-types";
import axios from "axios";
import * as React from "react";

import {useContext, useEffect, useState} from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {
    Avatar,
    Button,
    Container,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {getToken} from "../../../../utils/tokenService.jsx";
import * as XLXS from "xlsx";
import {UserContext} from "../../../context/UserContext.jsx";
import Box from "@mui/material/Box";

const EventDetailsParticipants = ({participants, eventSubmitter, isStudyGroup}) => {
    const {user} = useContext(UserContext);

    const exportParticipants = () => {
        const participantsExport = participants.map((participant) => {
            return {
                "First Name": participant.firstName,
                "Last Name": participant.lastName,
            }
        })
        const wb = XLXS.utils.book_new()
        const ws = XLXS.utils.json_to_sheet(participantsExport)
        XLXS.utils.book_append_sheet(wb, ws, "Participants")
        XLXS.writeFile(wb, "Participants.xlsx")
    }

    const showExportButton = () => {
        if (
            eventSubmitter === user._id &&
            participants.length > 0 &&
            !isStudyGroup
        ) {
            return (
                <Button onClick={exportParticipants}>Export Participants List</Button>
            );
        }
    };

    return (
        // (participants.length > 0) ?
        //     <Stack alignItems={"center"} height={"100%"}>
        //         <Stack spacing={3}>
        //             <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
        //                 {participants.map((participant) => (
        //                     <React.Fragment key={participant.id}>
        //                         <ListItem>
        //                             <ListItemText primary={`${participant.firstName} ${participant.lastName}`}/>
        //                         </ListItem>
        //                         <Divider variant="full-width" component="li"/>
        //                     </React.Fragment>
        //                 ))}

        //             </List>
        //             {showExportButton()}
        //         </Stack>
        //     </Stack> : <Stack alignItems={"center"}><Typography variant={"h6"}>There are no participants yet</Typography> </Stack>
        participants.length > 0 ? (
            <>
                <Container maxWidth="md">
                    <Paper elevation={2}>
                        <Box p={2}>
                            <Typography variant="h5" gutterBottom>
                                Participants List
                            </Typography>
                        </Box>
                        <List style={{maxHeight: '65vh', overflow: 'auto'}}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Avatar</TableCell>
                                            <TableCell>First Name</TableCell>
                                            <TableCell>Last Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {participants.map((participant, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {participant.profilePicture ? (
                                                        <Avatar src={participant.profilePicture}/>
                                                    ) : (
                                                        <Avatar>
                                                            {participant.firstName?.[0] +
                                                                participant.lastName?.[0]}
                                                        </Avatar>
                                                    )}
                                                </TableCell>
                                                <TableCell>{participant.firstName}</TableCell>
                                                <TableCell>{participant.lastName}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </List>
                    </Paper>
                </Container>
                {showExportButton()}
            </>
        ) : (
            <Stack alignItems={"center"}>
                <Typography variant={"h6"}>There are no participants yet</Typography>{" "}
            </Stack>
        )
    );
};
EventDetailsParticipants.propTypes = {
    eventSubmitter: PropTypes.string.isRequired,
    eventId: PropTypes.string.isRequired,
    isStudyGroup: PropTypes.bool.isRequired,
    participants: PropTypes.array.isRequired
}
export default EventDetailsParticipants