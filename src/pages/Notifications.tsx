import { Badge, Button, Grid2 as Grid, Pagination, Paper, Typography } from "@mui/material"
import { useSysNotifications } from "../features/notifications/useSysNotifications"
import { useNavigate } from "react-router-dom";
import { convertDate } from "../utils/helpers";
import { useNotificationsReader } from "../features/notifications/useNotificationsReader";
import { useDialogs } from "@toolpad/core";
import { useState } from "react";
import SpinnerLoader from "../ui/SpinnerLoader";

function Notifications() {
    const [page, setPage] = useState(1)
    const { notifications, isLoading } = useSysNotifications(page);
    const { notificationsReader } = useNotificationsReader();


    const navigate = useNavigate();
    const dialogs = useDialogs();

    const markAllAsRead = async () => {
        const confirm = await dialogs.confirm('Are you sure you want to mark all notifications as read?', {
            title: 'Mark all as read✅',
            okText: 'Yes'
        }
        )

        if (confirm)
            notificationsReader({ action: 'readAll' })
    }

    return (
        <Grid component={Paper} container flexDirection={'column'} padding={2} spacing={3} flex={1}>
            <Grid container flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4" color="primary.main">
                    Notifications
                </Typography>
                <Pagination count={notifications?.metadata.totalPages} disabled={isLoading} page={page} onChange={(e, val) => setPage(val)} variant="outlined" color="primary" sx={{
                    order: { xs: 2, sm: 1 }
                }} />
                <Button variant="contained" size={'small'} onClick={markAllAsRead}
                    sx={{
                        order: { xs: 1, sm: 2 }
                    }}
                >Mark all as read</Button>
            </Grid>

            <Grid container flexDirection={'column'} spacing={0} borderTop={2} borderColor={'primary.main'} paddingTop={2}>
                {
                    isLoading && <SpinnerLoader />
                }
                {
                    notifications?.items.map((item, ind) =>
                        <Grid container flexDirection={'column'}
                            sx={{
                                padding: 2,
                                bgcolor: `${item.isRead ? '' : 'primary.light'}`,
                                '&:hover': {
                                    bgcolor: 'whiteSmoke',
                                    cursor: 'pointer'
                                },
                                borderBottom: 1
                            }}
                            key={ind}
                            onClick={
                                () => {
                                    navigate(`/notifications/${item.id}`)
                                }
                            }
                        >
                            <Grid container width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={3}>
                                <Grid container flexDirection={'column'} >
                                    <Typography fontWeight={500} variant="h6">
                                        {item.title}
                                    </Typography>

                                    <Typography sx={{
                                        fontSize: 14
                                    }}>
                                        {item.content}
                                    </Typography>

                                    <Typography fontSize={12} color="grey" marginTop={2} >
                                        {convertDate(item.createdAtUtc)}
                                    </Typography>
                                </Grid>
                                {
                                    !item.isRead
                                    &&
                                    <Badge color="primary" variant="dot" sx={{ marginRight: 2 }}>
                                    </Badge>
                                }
                            </Grid>
                        </Grid>
                    )
                }

                {
                    notifications?.items.length === 0 &&
                    <Typography variant="h6">
                        You don't have any notification yet.😎
                    </Typography>
                }
            </Grid>


        </Grid>
    )
}

export default Notifications