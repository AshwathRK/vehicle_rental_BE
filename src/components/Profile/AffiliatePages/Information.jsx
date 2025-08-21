import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Information() {
    
    const [expanded, setExpanded] = useState(false);
    const [affiliate, setAffiliate] = useState([])
    const [vehicleInfo, setVehicleInfo] = useState({});
    const navigator = useNavigate()

    const handleChange = (panel, userId) => async (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);

        if (isExpanded && !vehicleInfo[userId]) {
            try {
                const response = await axios.get(`${serverUrl}/affiliate/${userId}`, { withCredentials: true });
                setVehicleInfo(prev => ({ ...prev, [userId]: response.data.data }));
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        const fetchAffiliateUsers = async () => {
            try {
                const response = await axios.get(`${serverUrl}/getaffiliate`)
                setAffiliate(response.data.affiliates)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAffiliateUsers()
    }, [])

    // console.log(affiliate)
    return (
        <div className='w-full h-full bg-[#d4d4d4] overflow-y-auto p-2 md:p-4'>
            <div className='w-full'>
                {
                    affiliate.map((value, key) => {
                        return (
                            <Accordion key={key} className='!rounded-[0]' expanded={expanded === `panel${key}`} onChange={handleChange(`panel${key}`, value._id)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel${key}bh-content`}
                                    id={`panel${key}bh-header`}
                                >
                                    <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                                        <h6 className='poppins-semibold m-0 text-sm md:text-base'>
                                            {value.fullname.charAt(0).toUpperCase() + value.fullname.slice(1)}
                                        </h6>
                                    </Typography>
                                    <Typography component="span" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                                        {value.email}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <div className='h-auto w-full flex flex-col md:flex-row'>
                                            <div className='w-full md:w-[50%]'>
                                                <div className='flex justify-between md:justify-start'>
                                                    <h6 className='px-2 poppins-semibold text-sm md:text-base'>Account No:</h6>
                                                    <h6 className='text-sm md:text-base'>{value.accountnumber || "-"}</h6>
                                                </div>
                                                <div className='flex justify-between md:justify-start'>
                                                    <h6 className='px-2 poppins-semibold text-sm md:text-base'>IFSC code:</h6>
                                                    <h6 className='text-sm md:text-base'>{value.ifsc || "-"}</h6>
                                                </div>
                                            </div>
                                            <div className='w-full md:w-[50%]'>
                                                <div className='flex justify-between md:justify-start'>
                                                    <h6 className='px-2 poppins-semibold text-sm md:text-base'>Phone:</h6>
                                                    <h6 className='text-sm md:text-base'>{value.phone || "-"}</h6>
                                                </div>
                                                <div className='flex justify-between md:justify-start'>
                                                    <h6 className='px-2 poppins-semibold text-sm md:text-base'>Secondary Mobile:</h6>
                                                    <h6 className='text-sm md:text-base'>{value.secondary || "-"}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            vehicleInfo[value._id] && vehicleInfo[value._id].map((vehicle, key) => (
                                                <div key={key} className='flex flex-wrap items-center justify-around py-2 border border-[#d4d4d4] text-sm md:text-base'>
                                                    <h6 className='m-0'>{key + 1}</h6>
                                                    <h6 className='m-0'>{vehicle.licensePlate}</h6>
                                                    <h6 className='m-0'>{`${vehicle.make} ${vehicle.model}`}</h6>
                                                    <Stack spacing={2} direction="row">
                                                        <Button onClick={()=>{
                                                            navigator(`/profile/carinfo/carriview/${vehicle?._id}`)
                                                        }} variant="text" size="small">More Info</Button>
                                                    </Stack>
                                                </div>
                                            ))
                                        }
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })

                }
            </div>
        </div>
    )
}
