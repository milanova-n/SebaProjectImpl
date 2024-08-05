import {
    Stack,
    Typography
} from "@mui/material"
import backgroundImage from "../../../public/TUM_Uhrenturm.jpg"
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import FAQ from "./FAQ.jsx";

const FAQPage = () => {
    return (
        <>
            <Header/>

            <Stack sx={{
                paddingTop: "20vh",
                paddingBottom: "10vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: "100%",
            }}
                   height={"100vh"}
                   spacing={3}
                   alignItems={"center"}
                   padding={"20px"}
            >
                <Stack sx={{
                    padding: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "4px solid #FFFFFF",
                    borderRadius: "10px",
                    width: "50%",
                    marginTop: 400,
                }}
                       alignItems={"center"}
                       spacing={2}
                >
                    <Typography color={"white"} variant={"h3"}>FAQs</Typography>
                </Stack>


            </Stack>
            <FAQ/>
            <Footer/>
        </>
    )
}

export default FAQPage