import './App.css';
import { Routes, Route } from "react-router-dom";
import {Home, About, Login, Profile, Register,} from '../src/Pages/PagesExport'
import Header from "./Components/Header";
import PrivateRoutes from './Components/PrivateRoutes';
import CreateListing from './Pages/CreateListing';
import UpdateUser from './Pages/UpdateUser';
import Listing from './Pages/Listing';
import Search from './Pages/Search';

const App = () => {
  return (
    <>
     <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sign-in" element={<Login/>} />
        <Route path="/sign-up" element={<Register/>} />
        <Route element={ <PrivateRoutes /> } >
        <Route path="/profile" element={<Profile/>} />
        <Route path='/create-listing' element={<CreateListing/>} />
        <Route path='/update-listing/:id' element={<UpdateUser/>}/>
        </Route>
        <Route path='/listing/:id' element={<Listing/>}/>
        <Route path="/about-us" element={<About/>} />
        <Route path='/search' element={<Search/>}/>
      </Routes> 
    </>
  )
}

export default App;
