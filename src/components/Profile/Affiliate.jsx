import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import AffiliateRegisterPage from './AffiliatePages/AffiliateRegisterPage';
import Information from './AffiliatePages/Information';
import Showcase from './AffiliatePages/Showcase';
import { ClimbingBoxLoader } from 'react-spinners';
import AffiliateInfo from './AffiliatePages/AffiliateInfo';
import PrivateRoute from '../../PrivateRoute';


// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Affiliate() {

	const [userInfo, setuseInfo] = useState([]);
	const [loadder, setLoadder] = useState(false)

	// Get tokens form the local storage
	const accessToken = sessionStorage.getItem('accessToken');
	const deviceId = sessionStorage.getItem('deviceId');

	useEffect(() => {
		const checkAuth = async () => {
			setLoadder(true)
			try {
				const res = await axios.get(`${serverUrl}`, {
					withCredentials: true,
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Device-Id': deviceId
					}
				});

				setuseInfo(res.data.user);
				setLoadder(false)
			} catch (err) {
				console.log(err?.response?.data?.message || "Not logged in");
				setLoadder(false)
			}
		};
		checkAuth();
	}, []);

	if (loadder) {
		return (
			<div className='w-full h-full flex items-center justify-center'>
				<ClimbingBoxLoader />
			</div>
		)
	}

	return (
		<div className='w-full h-full flex items-center justify-center'>
			<div className='h-[98%] w-[96%] bg-white border rounded overflow-y-auto hide-scrollbar'>
				<header className='w-full h-[10%] border-b border-[#d4d4d4] flex items-center'>
					<div className='flex items-center'>
						<div className='w-8 h-8 border flex items-center justify-center mx-3 rounded'>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
							</svg>
						</div>
						<h6 className='m-0 poppins-semibold'>Affiliate</h6>
					</div>
				</header>
				<div className='h-[90%] flex '>
					{
						userInfo.profileType === 'Admin' ?
							<Information /> :
							userInfo.profileType === 'Affiliate' ? <AffiliateInfo /> :
								<>
									<Routes>
										<Route element={<PrivateRoute />}>

											<Route path='/' element={
												<Showcase />
											} />
											<Route path='/affiliateregister/:id' element={
												<AffiliateRegisterPage />
											} />

										</Route>
									</Routes>
								</>
					}
				</div>
			</div>
		</div>
	)
}
