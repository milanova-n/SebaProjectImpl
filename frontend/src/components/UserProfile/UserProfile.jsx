import {useContext} from "react";
import ProfileCard from "./components/ProfileCard.jsx";
import useAuth from "../../../utils/useAuth.jsx";
import {Stack} from "@mui/material";
import EventCarousel from "./components/EventCarousel.jsx";
import AddCourses from "./components/AddCourses.jsx";
import AddHobbies from "./components/AddHobbies.jsx";
import Header from "../Header.jsx";
import Box from "@mui/material/Box";
import Footer from "../Footer.jsx";
import backgroundImage from "../TUM_Uhrenturm.jpg";
import {UserContext} from "../../context/UserContext.jsx";

const ProfilePage = () => {
    // const [user, setUser] = useState([]);
    // const {userId} = useParams();
    const isAuthenticated = useAuth();
    const {user} = useContext(UserContext);

    const userName = user.firstName + " " + user.lastName;

    return (
        <>
            <Header/>

            <Stack>
                <Box
                    sx={{
                        width: "100%",
                        height: "25vh",
                        minHeight: "250px",
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                />
                <Box width={"auto"} paddingTop={"0vh"}>
                    <div>
                        {isAuthenticated ? (
                            <Stack direction="row" spacing={0} padding={"50px"}>
                                <Stack direction="column" sx={{alignItems: "center"}}>
                                    <ProfileCard
                                        id={user._id}
                                        name={userName}
                                        dateOfBirth={user.dateOfBirth}
                                        companyPosition={user.profession}
                                        companyName={user.companyName}
                                        email={user.email}
                                        linkedin={user.linkedIn}
                                        instagram={user.instagram}
                                    />
                                </Stack>
                                <Stack
                                    direction="column"
                                    spacing={2}
                                    sx={{paddingLeft: "3vh", width: "70%"}}
                                >
                                    {user.role === "student" && (
                                        <>
                                            <AddCourses/>
                                            <AddHobbies/>
                                        </>
                                    )}
                                    <Stack sx={{backgroundColor: "white"}} spacing={1}>
                                        {user.role === "student" && (
                                            <EventCarousel
                                                events={user.eventsParticipated ? user.eventsParticipated : []}
                                                title={"My booked Events"} edit={false}/>
                                        )}
                                        <EventCarousel events={user.eventsCreated ? user.eventsCreated : []}
                                                       title={"Submitted Events"} edit={true}/>
                                    </Stack>
                                </Stack>
                            </Stack>
                        ) : (
                            <div> You dont have access to this page </div>
                        )}
                    </div>
                </Box>
            </Stack>
            <Footer/>
        </>
    );
};

export default ProfilePage;
