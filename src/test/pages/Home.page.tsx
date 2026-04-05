import Sidebar from "../components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RadioShowcase from "../inputs/radio/Radio.test";

function TestPageRoutes () {
    return(
        <Router>
            <Routes>
                <Route path="/test/components/radio-buttons" element={<RadioShowcase/>}/>
            </Routes>
        </Router>

    )
}

export default function TestHomePage () {
    return (
        <div>
            <Sidebar/>
            <TestPageRoutes/>
        </div>
    )
}