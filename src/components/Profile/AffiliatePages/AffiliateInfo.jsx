import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function AffiliateInfo() {

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setuseInfo] = useState([]);
    // const navigate = useNavigate()
    const [loadder, setLoadder] = useState(false)
    const [touched, setTouched] = useState({});

    // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        postal: '',
        country: '',
        accountnumber: '',
        ifsc: '',
        accountholder: '',
        bankname: ''
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoadder(true)
                const res = await axios.get(`${serverUrl}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });
                if (res.status === 200) {
                    setuseInfo(res.data.user);
                }
                setLoadder(false)
            } catch (err) {
                console.log(err?.response?.data?.message || "Not logged in");
            }
        };
        checkAuth();
    }, []);

    const handleOnClickEdit = () => {
        setIsEditing(true);

    };


    const validateForm = () => {
        const newErrors = {};
        if (touched.accountnumber && !formData.accountnumber) newErrors.accountnumber = 'Account Number is required';
        if (touched.ifsc && !formData.ifsc) newErrors.ifsc = 'IFSC Code is required';
        if (touched.accountholder && !formData.accountholder) newErrors.accountholder = 'Account holder name is required';
        if (touched.bankname && !formData.bankname) newErrors.bankname = 'Bank Name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const id = userInfo._id
                const response = await axios.put(`${serverUrl}/user/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });
                if (response.status === 200) {

                    // navigate('/profile/affiliate')
                    setIsEditing(false)
                    toast.success('Affiliate information updated!')
                } else {
                    console.log('Error updating user:', response.data.message);
                    // Handle error
                }
            } catch (error) {
                console.error('Error updating user:', error);
                // Handle error
            }
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleCancel = () => {
        if (!userInfo) return;
        setIsEditing(false);
    }

    // console.log(userInfo)

    return (
        <div className='w-full h-full flex px-4 flex-col'>
            <form>
                <div className='flex justify-between'>
                    <h6 className='poppins-requler h-10 flex items-center m-2'>Address</h6>
                </div>
                <div className='flex flex-wrap border-b border-[#d4d4d4] pb-2'>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="address" className='poppins-semibold text-sm my-2'>Address Line 1</label>
                        <input type="text" name="address" disabled={!isEditing} value={formData.address ? formData.address : userInfo.address} disable onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium ${isEditing ? '' : 'bg-zinc-100'} !text-[13px]`} placeholder='1st Floor, Olypub Building, Mirza Ghalib Street' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="city" className='poppins-semibold text-sm my-2'>City</label>
                        <input type="input" name="city" disabled={!isEditing} value={formData.city ? formData.city : userInfo.city} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium ${isEditing ? '' : 'bg-zinc-100'} !text-[13px]`} placeholder='Kolkata' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="state" className='poppins-semibold text-sm my-2'>State</label>
                        <input type="input" name="state" disabled={!isEditing} value={formData.state ? formData.state : userInfo.state} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium ${isEditing ? '' : 'bg-zinc-100'} !text-[13px]`} placeholder='West Bengal' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="postal" className='poppins-semibold text-sm my-2'>Postal</label>
                        <input type="number" name="postal" disabled={!isEditing} value={formData.postal ? formData.postal : userInfo.postal} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium ${isEditing ? '' : 'bg-zinc-100'} !text-[13px]`} placeholder='700016' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="country" className='poppins-semibold text-sm my-2'>Country</label>
                        <input type="input" name="country" disabled={!isEditing} value={formData.country ? formData.country : userInfo.country} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium ${isEditing ? '' : 'bg-zinc-100'} !text-[13px]`} placeholder='India' />
                    </div>
                </div>

                {/* ===============Bank Info============== */}
                <h6 className='poppins-requler h-10 flex items-center m-2'>Bank Details</h6>
                <div className='flex flex-wrap pb-5'>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="accountnumber" className='poppins-semibold text-sm my-2'>Account Number *</label>
                        <input type="number" disabled={!isEditing} name="accountnumber" value={formData.accountnumber ? formData.accountnumber : userInfo.accountnumber} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${isEditing ? '' : 'bg-zinc-100'} ${errors.accountnumber ? 'border-red-500' : ''}`} placeholder='eg: 123456789012' />
                        {errors.accountnumber && touched.accountnumber && <p className='text-red-500 text-xs'>{errors.accountnumber}</p>}
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="ifsc" className='poppins-semibold text-sm my-2'>IFSC Code *</label>
                        <input type="input" disabled={!isEditing} name="ifsc" value={formData.ifsc ? formData.ifsc : userInfo.ifsc} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${isEditing ? '' : 'bg-zinc-100'} ${errors.ifsc ? 'border-red-500' : ''}`} placeholder='SBIN0001234' />
                        {errors.accountnumber && touched.accountnumber && <p className='text-red-500 text-xs'>{errors.ifsc}</p>}
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="accountholder" className='poppins-semibold text-sm my-2'>Account holder name *</label>
                        <input type="input" disabled={!isEditing} name="accountholder" value={formData.accountholder ? formData.accountholder : userInfo.accountholder} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${isEditing ? '' : 'bg-zinc-100'} ${errors.accountholder ? 'border-red-500' : ''}`} placeholder='John Mick' />
                        {errors.accountnumber && touched.accountnumber && <p className='text-red-500 text-xs'>{errors.accountholder}</p>}
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="bankname" className='poppins-semibold text-sm my-2'>Bank Name *</label>
                        <input type="text" disabled={!isEditing} name="bankname" value={formData.bankname ? formData.bankname : userInfo.bankname} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${isEditing ? '' : 'bg-zinc-100'} ${errors.bankname ? 'border-red-500' : ''}`} placeholder='Union bank' />
                        {errors.accountnumber && touched.accountnumber && <p className='text-red-500 text-xs'>{errors.bankname}</p>}
                    </div>
                </div>
                <div className='w-full flex justify-end px-5'>
                    <Stack direction="row" spacing={2}>
                        {isEditing && (
                            <Button variant="contained" onClick={handleCancel}>
                                Cancel
                            </Button>
                        )}
                        {
                            isEditing ?
                                <Button variant="contained" onClick={handleSubmit} color="success">
                                    Submit
                                </Button> :
                                <Button variant="contained" onClick={handleEdit} color="secondary">
                                    Edit
                                </Button>
                        }

                    </Stack>
                </div>
            </form>
            <ToastContainer/>
        </div>
    )
}
