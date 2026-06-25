import { useState, useEffect } from "react";
import {
  LocalizationProvider,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import { PickerDay } from "@mui/x-date-pickers/PickerDay";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux";

const DateRangeFilter = ({ onChange, onClose }) => {

  const { startDate, endDate } = useSelector(
    (state: RootState) => state.dateRange
  );

  // default
  const defaultStart = dayjs().subtract(3, "month");
  const defaultEnd = dayjs();

  const [tempStart, setTempStart] = useState(startDate ? dayjs(startDate) : defaultStart);
  const [tempEnd, setTempEnd] = useState(endDate ? dayjs(endDate) : defaultEnd);


  useEffect(() => {
    if (startDate && endDate) {
      setTempStart(dayjs(startDate));
      setTempEnd(dayjs(endDate));
    }
  }, [startDate, endDate]);


  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange?.({
        startDate: tempStart.toISOString(),
        endDate: tempEnd.toISOString(),
      });

      onClose?.();
    }
  };

  const handleCancel = () => {
    setTempStart(startDate ? dayjs(startDate) : defaultStart);
    setTempEnd(endDate ? dayjs(endDate) : defaultEnd);
    onClose?.();
  };

  const displayStart = startDate ? dayjs(startDate) : tempStart;
  const displayEnd = endDate ? dayjs(endDate) : tempEnd;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2 }}>

        {/* Header */}
        <Typography sx={{ fontSize: 13, mb: 2, color: "#6b7280" }}>
          Period: {displayStart.format("MM/DD/YYYY")} -{" "}
          {displayEnd.format("MM/DD/YYYY")}
        </Typography>

        {/* Dual calendars */}
        <Box sx={{ display: "flex", gap: 2 }}>

          {/* START DATE */}
          <StaticDatePicker
            value={tempStart}
            onChange={(newVal) => {
              if (!newVal) return;

              setTempStart(newVal);

              if (tempEnd && newVal.isAfter(tempEnd)) {
                setTempEnd(newVal);
              }
            }}
            slots={{
              toolbar: () => null,
              actionBar: () => null,

              day: (props) => {
                const { day, selected, ...other } = props;

                const inRange =
                  tempStart &&
                  tempEnd &&
                  (
                    day.isSame(tempStart, "day") ||
                    day.isSame(tempEnd, "day") ||
                    (day.isAfter(tempStart) && day.isBefore(tempEnd))
                  );

                const isStart = tempStart && day.isSame(tempStart, "day");
                const isEnd = tempEnd && day.isSame(tempEnd, "day");

                return (
                  <PickerDay
                    {...other}
                    day={day}
                    selected={selected}
                    sx={{
                      ...(inRange && {
                        backgroundColor: "rgba(37,99,235,0.2)",
                      }),
                      ...(isStart && {
                        backgroundColor: "#2563eb",
                        color: "#fff",
                      }),
                      ...(isEnd && {
                        backgroundColor: "#2563eb",
                        color: "#fff",
                      }),
                    }}
                  />
                );
              },
            }}
          />

          {/* END DATE */}
          <StaticDatePicker
            value={tempEnd}
            onChange={(newVal) => {
              if (!newVal) return;

              if (tempStart && newVal.isBefore(tempStart)) {
                alert("End date cannot be before start date");
                return;
              }

              setTempEnd(newVal);
            }}
            slots={{
              toolbar: () => null,
              actionBar: () => null,

              day: (props) => {
                const { day, selected, ...other } = props;

                const inRange =
                  tempStart &&
                  tempEnd &&
                  (
                    day.isSame(tempStart, "day") ||
                    day.isSame(tempEnd, "day") ||
                    (day.isAfter(tempStart) && day.isBefore(tempEnd))
                  );

                const isStart = tempStart && day.isSame(tempStart, "day");
                const isEnd = tempEnd && day.isSame(tempEnd, "day");

                return (
                  <PickerDay
                    {...other}
                    day={day}
                    selected={selected}
                    sx={{
                      ...(inRange && {
                        backgroundColor: "rgba(37,99,235,0.2)",
                      }),
                      ...(isStart && {
                        backgroundColor: "#2563eb",
                        color: "#fff",
                      }),
                      ...(isEnd && {
                        backgroundColor: "#2563eb",
                        color: "#fff",
                      }),
                    }}
                  />
                );
              },
            }}
          />

        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
            }}
          >
            Apply
          </Button>
        </Box>

      </Box>
    </LocalizationProvider>
  );
};

export default DateRangeFilter;