import {useRef, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { 
  updateUserStart,
  updateUserFailure, 
  updateUserSuccess, 
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure
 } from '../Redux/user/UserSlice'; 
import { app } from '../Firebase/Firebase';
import Notiflix from "notiflix";

const Profile = () => {

const {currentUser, loading, error} = useSelector(state => state.user); 
//getting the authenticated user

  
  const fileRef = useRef(null); //for the image
  const dispatch = useDispatch();
  
  
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  

  //handles the input change
  const handleChange =(e)=>{
    setFormData({ ...formData, [e.target.id] : e.target.value })
  };


  useEffect(() => {
    if (file) {
      handleGoogleFileUpload(file);
    };
  }, [file]);
 
  //this func... handles the google flie upload 
  const handleGoogleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };


  //This logic is very important
  //handles the file change upload when the user update the profile img
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target.result;
  
        // Create a new image element
        const img = new Image();
        img.src = dataUrl;
  
        img.onload = () => {
          // Resize the image here if needed
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Resize to a desired width and height
          canvas.width = 300;
          canvas.height = 300;
  
          // Draw the image onto the canvas with the desired dimensions
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          // Get the resized data URL
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
  
          setFormData({ ...formData, avatar: resizedDataUrl });
          //console.log({ ...formData, avatar: resizedDataUrl });
        };
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  

  //handles the submit func...
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
     dispatch(updateUserFailure(error.message));
   }

  };

  //delete func...
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());

      const res =  await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data));
      //setUpdateSuccess(true);

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  
  const confirmDelete = () => {
    Notiflix.Confirm.show(
      "Delete Account!!!",
      "You are about to delete this account",
      "Delete",
      "Cancel",
      function okCb() {
        handleDelete();
      },
      function cancelCb() {
        console.log("Delete Canceled");
      },
      {
        width: "320px",
        borderRadius: "3px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };

  //logout func...
  const logout = async() => {
   try {
    dispatch(signoutUserStart());
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if (data.success === false) {
      dispatch(signoutUserFailure(data.message));
      return;
    }
      dispatch(signoutUserSuccess(data))
   } catch (error) {
    dispatch(signoutUserFailure(data));
   }
  };

  //
  const confirmLoggedout = () => {
    Notiflix.Confirm.show(
      "Logout Account!!!",
      "You are about to logout this account",
      "Logout",
      "Cancel",
      function okCb() {
        logout();
      },
      function cancelCb() {
        console.log("Logout Canceled");
      },
      {
        width: "320px",
        borderRadius: "3px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };


  //show listing functionality by user 
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/deleteUser/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };


  
  const comfirmhandleListingDelete = (listingId) => {
    Notiflix.Confirm.show(
      "Delete List!!!",
      "You are about to delete this list",
      "Yes",
      "Cancel",
      function okCb() {
        handleListingDelete(listingId)
      },
      function cancelCb() {
        console.log("Delete Canceled");
      },
      {
        width: "320px",
        borderRadius: "3px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        
        <input
        // onChange={(e) => handleFileChange(e)}
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
        <button  className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
           {!loading ? 'update': 'loading...'}
        </button>
        <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'> Create Listing </Link>        
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={confirmDelete} className='text-red-700 cursor-pointer'> Delete account </span>
        <span onClick={confirmLoggedout} className='text-red-700 cursor-pointer'> Sign out </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'> {updateSuccess ? 'User is updated successfully!' : ''} </p>

      <button onClick={handleShowListings} className='text-green-700 w-full'> show listings </button>
      <p className='text-red-700 mt-5'> {showListingsError ? 'Error showing listings' : ''} </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1'
               to={`/listing/${listing._id}`}> <p>{listing.title}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button className='text-red-700 uppercase' onClick={() => comfirmhandleListingDelete(listing._id)} > Delete </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
        
    </div>
  )
}

export default Profile;


