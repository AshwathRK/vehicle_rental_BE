import Category from './components/Home/Category';
import HeroSection from './components/Home/HeroSection';
import Navbar from './components/Home/Nav';
import Populer from './components/Home/Populer';
import Review from './components/Home/Review';
import Footer from './components/Home/Footer';
import { Route, Routes } from 'react-router-dom';
import LogIn from './components/Login';
import LineUp from './components/Lineup';
import Signup from './components/Signup';
import Search from './components/SearchPage';
import Profile from './components/Profile';
import PrivateRoute from './PrivateRoute';
import DetailedCarInfo from './components/DetailedCarInfo';

export default function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <>
                        <HeroSection />
                        <Category />
                        <Populer />
                        <Review />
                        <Footer />
                    </>
                } />
                <Route path="/login" element={
                    <>
                        <LogIn />
                    </>
                } />
                <Route path="/login/:id" element={
                    <>
                        <LogIn />
                    </>
                } />
                <Route path="/signup" element={
                    <>
                        <Signup />
                    </>
                } />
                <Route path="/lineup/:id?" element={
                    <>
                        <LineUp />
                    </>
                } />
                <Route path="/search" element={
                    <>
                        <Search />
                    </>
                } />
                <Route path="/car/:id" element={
                    <>
                        <DetailedCarInfo />
                    </>
                } />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile/*" element={<Profile />}
                    />
                </Route>
            </Routes>
        </div>
    );
}
