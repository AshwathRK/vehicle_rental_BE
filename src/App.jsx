import Category from './components/Home/Category';
import HeroSection from './components/Home/HeroSection';
import Nav from './components/Home/Nav';
import Populer from './components/Home/Populer';

export default function App() {
  return (
    <div>
      <Nav></Nav>
      <HeroSection />
      <Category/>
      <Populer/>
    </div>
  );
}
