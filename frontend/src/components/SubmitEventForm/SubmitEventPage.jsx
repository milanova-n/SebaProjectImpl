//import Header from "./Header";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import { Divider} from "@mui/material";
import Box from "@mui/material/Box";
import SubmitEventForm from "./SubmitEventForm.jsx";

function SubmitEventPage() {
    return (
        <div>
            <Header/>
            <Divider/>
            <Box>
                <SubmitEventForm />
            </Box>
            <Footer/>
        </div>
    );
}

export default SubmitEventPage;