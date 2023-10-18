import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { signInSuccess } from '../Redux/user/UserSlice';
import { useNavigate } from 'react-router-dom';
import { app } from '../Firebase/Firebase';


const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //handles google auth ... 
    const handleGoogleClick = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(app);
      
          const result = await signInWithPopup(auth, provider);
      
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL,
            }),
          });
      
          if (res.ok) {
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
          } else {
            console.error('Error during Google Sign-In:', res.status, res.statusText);
            // Handle the error as needed (e.g., show an error message to the user).
          }
        } catch (error) {
          console.error('An error occurred during Google Sign-In:', error);
          // Handle the error as needed (e.g., show an error message to the user).
        }
      };
      
    
  return (
    <button
    onClick={handleGoogleClick}
    type='button'
    className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
  >
    Continue with google
  </button>
  )
}

export default OAuth;
