import {useRef, useState} from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import { updateUserStart, updateUserFailure, updateUserSuccess, signInFailure } from '../Redux/user/UserSlice';


const Profile = () => {

  const {currentUser, loading, error} = useSelector(state => state.user); //getting the authenticated user
  
  const fileRef = useRef(null); //for the image
  const dispatch = useDispatch();
  
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  

  const handleChange =(e)=>{
    setFormData({...formData, [e.target.id] : e.target.value })
  };

  const handleSubmit = async (e)=>{
   e.preventDefault()
   try {
    dispatch(updateUserStart())
                                //passing the id to the backend
    const res =  await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(updateUserFailure(data.message))
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
   } catch (error) {
     dispatch(updateUserFailure(error.message))
   }

  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        
        <input
          type='text'
          placeholder='username'
          id='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          defaultValue={currentUser.password}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...': 'update'}
        </button>
        
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'> Delete account </span>
        <span className='text-red-700 cursor-pointer'> Sign out </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'> {updateSuccess ? 'User is updated successfully!' : ''} </p>
        
    </div>
  )
}

export default Profile;
