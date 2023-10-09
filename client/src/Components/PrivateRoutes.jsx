import {useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';


const PrivateRoutes = () => {

    const {currentUser} = useSelector(state => state.user); //getting the authenticated user 

  return (
    <div>
      { currentUser ? (<Outlet/>) : (<Navigate to={'/sign-in'}/>)} 
    </div>
  )
}

export default PrivateRoutes;
