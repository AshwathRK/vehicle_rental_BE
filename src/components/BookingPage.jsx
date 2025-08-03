import React from 'react';
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import Button from '@mui/material/Button';
// import TimePicker from 'react-time-picker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function BookingPage() {
    // Stepper state
    const [stepper, setStepper] = React.useState({
        activeStep: 0,
    });

    const [tabValue, setTabValue] = React.useState('1');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const today = new Date();
    const [state, setState] = useState([
        {
            startDate: today,
            endDate: today,
            key: 'selection'
        }
    ]);

    const handleRangeChange = (item) => {
        if (item.selection.endDate === null) {
            setState([{ ...item.selection, endDate: item.selection.startDate }]);
            setValue([dayjs(item.selection.startDate), dayjs(item.selection.startDate)]);
        } else {
            setState([item.selection]);
            setValue([dayjs(item.selection.startDate), dayjs(item.selection.endDate)]);
        }
    };

    const disabledDates = [
        new Date(2025, 7, 4),
        new Date(2025, 7, 7),
        new Date(2025, 7, 10)
    ];

    const isDisabled = (date) => {
        return disabledDates.some((disabledDate) => {
            return date.getTime() === disabledDate.getTime();
        });
    };

    const [value, setValue] = useState([dayjs(), dayjs().add(1, 'day')]);

    console.log(value[0].format('YYYY-MM-DD HH:mm:ss'));
    console.log(value[1].format('YYYY-MM-DD HH:mm:ss'));

    const handlePredefinedRange = (range) => {
        const today = new Date();
        let startDate, endDate;

        switch (range) {
            case 'Today':
                startDate = today;
                endDate = today;
                break;
            case 'Tomorrow':
                const tomorrow = new Date(today.getTime() + 86400000);
                startDate = tomorrow;
                endDate = tomorrow;
                break;
            case 'This Week':
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                startDate = firstDayOfWeek;
                endDate = lastDayOfWeek;
                break;
            case 'This Month':
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                startDate = firstDayOfMonth;
                endDate = lastDayOfMonth;
                break;
            default:
                return;
        }

        setState([
            {
                startDate,
                endDate,
                key: 'selection'
            }
        ]);
    };


    return (
        <div className="h-[calc(99.8vh-78.4px)] flex relative top-[78px]">
            <div className="w-[20%] flex items-center justify-center border-r border-[#d4d4d4]">
                <Stepper
                    orientation="vertical"
                    sx={(theme) => ({
                        '--Stepper-verticalGap': '10rem',
                        '--StepIndicator-size': '2.5rem',
                        '--Step-gap': '1rem',
                        '--Step-connectorInset': '0.5rem',
                        '--Step-connectorRadius': '1rem',
                        '--Step-connectorThickness': '4px',
                        '--joy-palette-success-solidBg': 'var(--joy-palette-success-400)',
                        [`& .${stepClasses.completed}`]: {
                            '&::after': { bgcolor: 'success.solidBg' },
                        },
                        [`& .${stepClasses.active}`]: {
                            [`& .${stepIndicatorClasses.root}`]: {
                                border: '4px solid',
                                borderColor: '#fff',
                                boxShadow: `0 0 0 1px ${theme.vars.palette.primary[500]}`,
                            },
                        },
                        [`& .${stepClasses.disabled} *`]: {
                            color: 'neutral.softDisabledColor',
                        },
                        [`& .${typographyClasses['title-sm']}`]: {
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '10px',
                        },
                    })}
                >
                    <Step
                        active={stepper.activeStep === 0}
                        completed={stepper.activeStep > 0}
                        indicator={
                            <StepIndicator
                                variant="solid"
                                color={stepper.activeStep < 1 ? 'primary' : 'success'}
                            >
                                {stepper.activeStep < 1 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                                        />
                                    </svg>
                                ) : (
                                    <CheckRoundedIcon />
                                )}
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 1</Typography>
                            Choose Booking Date
                        </div>
                    </Step>

                    <Step
                        active={stepper.activeStep === 1}
                        completed={stepper.activeStep > 1}
                        indicator={
                            <StepIndicator
                                variant="solid"
                                color={stepper.activeStep < 2 ? 'primary' : 'success'}
                            >
                                {stepper.activeStep < 2 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                                        />
                                    </svg>
                                ) : (
                                    <CheckRoundedIcon />
                                )}
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 2</Typography>
                            Booking Review
                        </div>
                    </Step>

                    <Step
                        active={stepper.activeStep === 2}
                        completed={stepper.activeStep > 2}
                        indicator={
                            <StepIndicator variant="solid" color="primary">
                                <AppRegistrationRoundedIcon />
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 3</Typography>
                            Payment details
                        </div>
                    </Step>
                </Stepper>
            </div>
            <div className="w-[80%] flex p-4 overflow-y-auto gap-4 flex-col items-center">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabValue}>
                        <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                            <Tab label="Step 1" value="1" />
                        </TabList>
                        <TabPanel value="1">
                            <h6 className='!text-[24px] poppins-bold'>Car Availability</h6>
                            <div className="w-[60%]">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'MultiInputDateTimeRangeField',
                                        ]}
                                    >
                                        <MultiInputDateTimeRangeField
                                            value={value}
                                            onChange={(newValue) => setValue(newValue)}
                                            slotProps={{
                                                textField: ({ position }) => ({
                                                    label: position === 'start' ? 'Check-in' : 'Check-out',
                                                }),
                                            }}
                                            format="DD/MM/YYYY hh:mm a"
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                            <div className='flex justify-center gap-5'>
                                <div className="mb-4 flex flex-col gap-2 items-start justify-center">
                                    <Button onClick={() => handlePredefinedRange('Today')}>Today</Button>
                                    <Button onClick={() => handlePredefinedRange('Tomorrow')}>Tomorrow</Button>
                                    <Button onClick={() => handlePredefinedRange('This Week')}>This Week</Button>
                                    <Button onClick={() => handlePredefinedRange('This Month')}>This Month</Button>
                                </div>
                                <DateRangePicker
                                    onChange={handleRangeChange}
                                    showSelectionPreview={true}
                                    moveRangeOnFirstSelection={false}
                                    months={2}
                                    minDate={new Date()}
                                    disablePast={true}
                                    ranges={state}
                                    direction="horizontal"
                                    preventSnapRefocus={true}
                                    calendarFocus="forwards"
                                    showDateDisplay={false}
                                    disabledDates={disabledDates.map((date) => date.getTime())}
                                />
                            </div>
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>
    );
}