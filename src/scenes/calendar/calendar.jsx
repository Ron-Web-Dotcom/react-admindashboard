import { useState, useEffect } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  CircularProgress
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { blink } from "../../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";
import { toast } from "react-hot-toast";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, isAuthenticated } = useBlinkAuth();
  const [currentEvents, setCurrentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!isAuthenticated || !user?.id) return;
    setLoading(true);
    try {
      const events = await blink.db.calendarEvents.list();
      // SQLite returns allDay as "0"/"1"
      setCurrentEvents(events.map(e => ({
        ...e,
        allDay: Number(e.allDay) > 0
      })));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isAuthenticated]);

  const handleDateClick = async (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      try {
        const newEvent = {
          id: `event_${Date.now()}`,
          userId: user.id,
          title,
          start: selected.startStr,
          end: selected.endStr,
          allDay: selected.allDay ? 1 : 0
        };
        await blink.db.calendarEvents.create(newEvent);
        
        calendarApi.addEvent({
          ...newEvent,
          allDay: selected.allDay
        });
        toast.success("Event added!");
      } catch (error) {
        console.error("Failed to add event:", error);
        toast.error("Failed to add event");
      }
    }
  };

  const handleEventClick = async (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'?`)) {
      try {
        await blink.db.calendarEvents.delete(selected.event.id);
        selected.event.remove();
        toast.success("Event deleted!");
      } catch (error) {
        console.error("Failed to delete event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
        <CircularProgress sx={{ color: colors.greenAccent[500] }} />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            initialEvents={currentEvents}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
