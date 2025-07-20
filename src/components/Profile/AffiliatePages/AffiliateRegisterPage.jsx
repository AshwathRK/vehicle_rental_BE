import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function AffiliateRegisterPage() {
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate()
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

    // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.accountnumber) newErrors.accountnumber = 'Account Number is required';
        if (!formData.ifsc) newErrors.ifsc = 'IFSC Code is required';
        if (!formData.accountholder) newErrors.accountholder = 'Account holder name is required';
        if (!formData.bankname) newErrors.bankname = 'Bank Name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCancel = () => {
        navigate('/profile')
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const response = await axios.put(`${serverUrl}/user/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });
                if (response.status === 200) {

                    navigate('/profile/affiliate')
                    // Handle success (e.g., show a toast notification)
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

    return (
        <div className='w-full h-full flex px-4 flex-col'>
            <form>
                <h6 className='poppins-requler h-10 flex items-center m-2'>Address</h6>
                <div className='flex flex-wrap border-b border-[#d4d4d4] pb-2'>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="address" className='poppins-semibold text-sm my-2'>Address Line 1</label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} placeholder='1st Floor, Olypub Building, Mirza Ghalib Street' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="city" className='poppins-semibold text-sm my-2'>City</label>
                        <input type="input" name="city" value={formData.city} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} placeholder='Kolkata' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="state" className='poppins-semibold text-sm my-2'>State</label>
                        <input type="input" name="state" value={formData.state} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} placeholder='West Bengal' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="postal" className='poppins-semibold text-sm my-2'>Postal</label>
                        <input type="number" name="postal" value={formData.postal} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} placeholder='700016' />
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="country" className='poppins-semibold text-sm my-2'>Country</label>
                        <input type="input" name="country" value={formData.country} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} placeholder='India' />
                    </div>
                </div>

                {/* ===============Bank Info============== */}
                <h6 className='poppins-requler h-10 flex items-center m-2'>Bank Details</h6>
                <div className='flex flex-wrap pb-5'>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="accountnumber" className='poppins-semibold text-sm my-2'>Account Number *</label>
                        <input type="number" name="accountnumber" value={formData.accountnumber} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} placeholder='eg: 123456789012' />
                        {errors.accountnumber && <p className='text-red-500 text-xs'>{errors.accountnumber}</p>}
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="ifsc" className='poppins-semibold text-sm my-2'>IFSC Code *</label>
                        <input type="input" name="ifsc" value={formData.ifsc} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.ifsc ? 'border-red-500' : ''}`} placeholder='SBIN0001234' />
                        {errors.ifsc && <p className='text-red-500 text-xs'>{errors.ifsc}</p>}
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="accountholder" className='poppins-semibold text-sm my-2'>Account holder name *</label>
                        <input type="input" name="accountholder" value={formData.accountholder} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountholder ? 'border-red-500' : ''}`} placeholder='John Mick' />
                        {errors.accountholder && <p className='text-red-500 text-xs'>{errors.accountholder}</p>}
                    </div>
                    <div className='w-full md:w-1/3 p-2'>
                        <label htmlFor="bankname" className='poppins-semibold text-sm my-2'>Bank Name *</label>
                        <input type="text" name="bankname" value={formData.bankname} onChange={handleInputChange} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.bankname ? 'border-red-500' : ''}`} placeholder='Union bank' />
                        {errors.bankname && <p className='text-red-500 text-xs'>{errors.bankname}</p>}
                    </div>
                </div>
                <div className='w-full flex justify-end px-5'>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} color="success">
                            Submit
                        </Button>
                    </Stack>
                </div>
            </form>
        </div>
    )
}