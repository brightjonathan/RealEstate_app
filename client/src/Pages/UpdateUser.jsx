import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { app } from '../Firebase/Firebase';
import { getDownloadURL, getStorage, ref,uploadBytesResumable } from 'firebase/storage';



const initialState = {
    title: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 5000,
    discountPrice: 3000,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
};

const UpdateUser = () => {

    const {id} = useParams()
    const navigate = useNavigate();

    const {currentUser} = useSelector(state => state.user);
    const [formData, setFormData] = useState(initialState);
    const {address, bathrooms,bedrooms, description, discountPrice, furnished, imageUrls, title, offer, parking, regularPrice, type} = formData;
    
    
    //
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);




    //tracking the input change on different input field
    const handleChange =(e)=>{

        //input field for the two checked button 
     if (e.target.id === 'sale' || e.target.id === 'rent' ) {
        setFormData({
          ...formData, 
          type: e.target.id
        });
     };

     //input field for true or false
     if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
        setFormData({
            ...formData, 
            [e.target.id]: e.target.checked
        })
    };

    //targeting the input field using type for values
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
        setFormData({
            ...formData, 
            [e.target.id]: e.target.value,
        })
    }

    };

    useEffect(()=>{

    const fetchingList =  async ()=>{
     const userId = id;
     const res = await fetch(`/api/listing/getUserlisting/${userId}`);
     const data = await res.json();
     if (data.success === false) {
        console.log(data.message);
        return;
     }
     setFormData(data);
    };

    fetchingList();
    }, []);


    
    //handles image files
    const handleImageSubmit = (e)=>{
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
      
            for (let i = 0; i < files.length; i++) {
              promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
              .then((urls) => {
                setFormData({
                  ...formData,
                  imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
              })
              .catch((err) => {
                setImageUploadError('Image upload failed (2mb max per image)');
                setUploading(false);
              });
          } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
          }
    } 

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };


      const handleRemoveImage = (index) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
      };
    

    //handles the form submit to the database 
    const handleSubmit =async (e)=>{
      e.preventDefault();
      //console.log(formData);
      try {


        if (imageUrls.length < 1) 
          return setError('You must upload at least one image');

        if (+formData.discountPrice > +formData.regularPrice)
          return setError('Discount price must be lower than regular price');

        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/updateUser/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userRef: 
            currentUser._id,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
          setError(data.message);
          console.log(data.message);
        }
       navigate(`/listing/${data._id}`);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
        setLoading(false);
      }
    };


  return (
    <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>
      Update your Listing
    </h1>
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
      <div className='flex flex-col gap-4 flex-1'>
        <input
          type='text'
          placeholder='Title'
          className='border p-3 rounded-lg'
          id='title'
          maxLength='62'
          minLength='10'
          required
          onChange={handleChange}
          value={title}
        />
        <textarea
          type='text'
          placeholder='Description'
          className='border p-3 rounded-lg'
          id='description'
          required
          onChange={handleChange}
          value={description}
        />
        <input
          type='text'
          placeholder='Address'
          className='border p-3 rounded-lg'
          id='address'
          required
          onChange={handleChange}
          value={address}
        />
        <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='sale'
              className='w-5'
              onChange={handleChange}
              checked={type === 'sale'}
            />
            <span>Sell</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='rent'
              className='w-5'
              onChange={handleChange}
              checked={type === 'rent'}
            />
            <span>Rent</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='parking'
              className='w-5'
              onChange={handleChange}
              checked={parking}
            />
            <span>Parking spot</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='furnished'
              className='w-5'
              onChange={handleChange}
              checked={furnished}
            />
            <span>Furnished</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='offer'
              className='w-5'
              onChange={handleChange}
              checked={offer}
            />
            <span>Offer</span>
          </div>
        </div>
        <div className='flex flex-wrap gap-6'>
          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='bedrooms'
              min='1'
              max='10'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={bedrooms}
            />
            <p>Beds</p>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='bathrooms'
              min='1'
              max='10'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={bathrooms}
            />
            <p>Baths</p>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='regularPrice'
              min='5000'
              max='10000000'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={regularPrice}
            />
            <div className='flex flex-col items-center'>
            <p>Regular price</p>
            <span className='text-xs'>(#/month)</span>
            </div>
          </div>
          {offer && (
          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='discountPrice'
              min='0'
              max='10000000'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={discountPrice}
            />
            <div className='flex flex-col items-center'>
            <p>Discount price</p>
            {type === 'rent' && (
            <span className='text-xs'>(#/month)</span>
            )}
            </div>
          </div>
          )}
        </div>
      </div>
      <div className='flex flex-col flex-1 gap-4'>
        <p className='font-semibold'>
          Images:
          <span className='font-normal text-gray-600 ml-2'>
            The first image will be the cover (max 6)
          </span>
        </p>
        <div className='flex gap-4'>
          <input
            onChange={(e) => setFiles(e.target.files)} 
            className='p-3 border border-gray-300 rounded w-full'
            type='file'
            id='images'
            accept='image/*'
            multiple
          />
          <button type='button'
          onClick={handleImageSubmit}
          className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
        {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center' 
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' 
                >
                  Delete
                </button>
              </div>
            ))}
        <button type='submit' className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
        {loading ? 'Creating...' : 'Update listing'}
        </button>
        {error && <p className='text-red-700 text-sm'>{error}</p>}
        
      </div>
    </form>
  </main>
  )
}

export default UpdateUser;


