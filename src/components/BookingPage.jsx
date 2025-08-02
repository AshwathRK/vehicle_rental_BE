import React from 'react'
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';

export default function BookingPage() {
    return (
        <div className='h-[calc(99.8vh-78.4px)] flex relative top-[78px]'>
            <div className='w-[20%] flex items-center justify-center'>
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
                        completed
                        indicator={
                            <StepIndicator variant="solid" color="success">
                                <CheckRoundedIcon />
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 1</Typography>
                            Choose Booking Date
                        </div>
                    </Step>
                    <Step
                        active
                        indicator={
                            <StepIndicator variant="solid" color="primary">
                                <CheckRoundedIcon />
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 2</Typography>
                            Booking Review
                        </div>
                    </Step>
                    <Step
                        // active
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
            <div className='w-[80%]'>
            </div>
        </div>
    )
}
