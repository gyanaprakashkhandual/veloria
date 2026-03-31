import Footer from "../../components/cores/Footer";
import Hero from "../../components/cores/Home.page";
import Navbar from "../../components/cores/Navbar";

export default function HomePage () {
    return (
        <div>
            <Navbar/>
            <main>
                <Hero/>
            </main>
            <Footer/>
        </div>
    )
}