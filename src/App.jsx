import Category from './components/Home/Category';
import HeroSection from './components/Home/HeroSection';
import Navbar from './components/Home/Nav'; // ✅ updated name
import Populer from './components/Home/Populer';
import Review from './components/Home/Review';
import Footer from './components/Home/Footer';
import { Route, Routes } from 'react-router-dom';
import LogIn from './components/Login';
import LineUp from './components/Lineup';
import Signup from './components/Signup';

export default function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={
                    <>
                        <Navbar />
                        <HeroSection />
                        <Category />
                        <Populer />
                        <Review />
                        <Footer />
                    </>
                } />
                <Route path="/login" element={
                    <>
                        <Navbar />
                        <LogIn />
                    </>
                } />
                <Route path="/signup" element={
                    <>
                        <Navbar />
                        <Signup />
                    </>
                } />
                <Route path="/lineup" element={
                    <>
                        <Navbar />
                        <LineUp />
                    </>
                } />
            </Routes>
        </div>
    );
}
