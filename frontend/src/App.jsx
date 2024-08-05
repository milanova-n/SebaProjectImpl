import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubmitEventPage from "./components/SubmitEventForm/SubmitEventPage.jsx";
import EventsPage from "./components/EventsPage/EventsPage.jsx";
import EventDetailsPage from "./components/EventDetailsPage/EventDetailsPage.jsx";
import FAQPage from "./components/FAQ/FAQPage.jsx";
import {UserProvider} from "./context/UserContext.jsx";
import LandingPage from "./components/landingPage/LandingPage.jsx";
import ForCompanies from "./components/forCompanies/ForCompanies.jsx";
import SignIn from "./components/UserHandling/signin/SignIn.jsx";
import SignUpStudent from "./components/UserHandling/signup/SignUpStudent.jsx";
import SignUpCompany from "./components/UserHandling/signup/SignUpCompany.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import Impressum from "./components/Impressum.jsx";
import GeneralTerms from "./components/GeneralTerms.jsx";
import AdminPage from "./components/AdminPage.jsx";
import EventSubmissionPaymentPage from "./components/Payment/EventSubmissionPaymentPage.jsx";
import BuyTicketPaymentPage from "./components/Payment/BuyTicketPaymentPage.jsx";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
import SubscriptionPage from "./components/Payment/Subscription/SubscriptionPage.jsx";
import NoAccessPage from "./components/NoAccess.jsx";
import RequestResetPassword from "./components/UserHandling/ResetPassword/RequestResetPassword.jsx";
import ResetPassword from "./components/UserHandling/ResetPassword/ResetPassword.jsx";
import ErrorPage from "./components/ErrorPage.jsx";

const App = () => {
    return (<Router>
        <UserProvider>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/forCompanies" element={<ForCompanies/>}/>
                <Route path="/companies" element={<ForCompanies/>}/>

                <Route path="/LogIn" element={<SignIn/>}/>

                <Route path="/register" element={<SignUpStudent/>}/>
                <Route path="/signUp" element={<SignUpStudent/>}/>

                <Route path="/signUpCompany" element={<SignUpCompany/>}/>

                <Route path="/submitEvent" element={<SubmitEventPage/>}/>

                <Route path="/events" element={<EventsPage/>}/>
                <Route
                    path="/events/:eventId"
                    element={<EventDetailsPage edit={false}/>}
                />
                <Route
                    path="/events/edit/:eventId"
                    element={<EventDetailsPage edit={true}/>}
                />

                <Route path="/faq" element={<FAQPage/>}/>
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>}/>
                <Route path="/Impressum" element={<Impressum/>}/>
                <Route path="/GeneralTerms" element={<GeneralTerms/>}/>

                <Route path="/profile/:userId" element={<UserProfile/>}/>

                <Route path="/submitEvent/payment/:eventId" element={<EventSubmissionPaymentPage/>}/>
                <Route path="/events/payment/:eventId" element={<BuyTicketPaymentPage/>}/>
                <Route path="/subscribe" element={<SubscriptionPage/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
                <Route path="/noAccess" element={<NoAccessPage/>}/>

                <Route path="/request-reset-password" element={<RequestResetPassword/>}/>
                <Route path="/reset-password/:token" element={<ResetPassword/>}/>

                <Route path="/error" element={<ErrorPage/>}/>

            </Routes>
        </UserProvider>
    </Router>);
};

export default App;

