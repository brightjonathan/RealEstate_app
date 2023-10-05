import './App.css';
import { Routes, Route } from "react-router-dom";
import {Home, About, Login, Profile, Register,} from '../src/Pages/PagesExport'
import Header from "./Components/Header";

const App = () => {
  return (
    <>
     <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sign-in" element={<Login/>} />
        <Route path="/sign-up" element={<Register/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/about-us" element={<About/>} />
      </Routes> 
    </>
  )
}

export default App;
