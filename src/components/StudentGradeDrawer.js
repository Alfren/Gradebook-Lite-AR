import {
  Box,
  Button,
  Drawer,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useUpdateStudentMutation } from "../store/rtk";

export default function StudentGradeDrawer({
  open,
  toggle,
  row,
  setRow,
  assignments,
}) {
  const [patchStudent] = useUpdateStudentMutation();
  const [grades, setGrades] = useState({});

  useEffect(() => {
    if (open && Object.keys(grades).length === 0) {
      setGrades({ ...row.grades });
    }
  }, [open, row.grades]);

  const reset = () => {
    setGrades({});
    setRow({});
    toggle();
  };

  const handleSave = () => {
    let calcGrades = { ...JSON.parse(JSON.stringify(grades)) };
    Object.entries(calcGrades).forEach(([key, val]) => {
      if (typeof val === "object") {
        const values = Object.values(val);
        const sum =
          values.reduce((total, toAdd) => total + toAdd) / values.length;
        calcGrades[key].TOTAL = sum;
      }
    });

    patchStudent({ id: row.id, body: { ...row, grades: calcGrades } })
      .then((resp) => {
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <Drawer anchor="right" open={open}>
      <Stack direction="row" height="100%">
        <Tooltip title="Close" arrow disableInteractive placement="left">
          <Button onClick={toggle} color="inherit">
            <ChevronRight />
          </Button>
        </Tooltip>
        <Stack m={2} spacing={1} minWidth={400}>
          <Typography align="center" variant="h4">
            {row.name}
          </Typography>
          {assignments.length > 0 &&
            assignments.map(({ id, title, type, parts }) => {
              return type === "Multiple" ? (
                <Box key={id} component={Paper} p={1} elevation={4}>
                  <Typography variant="body2" textTransform="uppercase" mb={1}>
                    {title}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {parts.map((part) => (
                      <TextField
                        key={`${part}-${id}`}
                        size="small"
                        sx={{ width: 140 }}
                        label={part}
                        type="number"
                        value={grades?.[id]?.[part] || ""}
                        onChange={(e) =>
                          setGrades({
                            ...grades,
                            [id]: {
                              ...grades[id],
                              [part]: Number(e.target.value),
                            },
                          })
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Box key={id} component={Paper} p={1} elevation={4}>
                  <Typography variant="body2" textTransform="uppercase" mb={1}>
                    {title}
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    value={grades?.[id] || ""}
                    onChange={(e) =>
                      setGrades({
                        ...grades,
                        [id]: Number(e.target.value),
                      })
                    }
                  />
                </Box>
              );
            })}
          <Stack direction="row" spacing={3} pt={1}>
            <Button
              onClick={handleSave}
              color="success"
              variant="contained"
              fullWidth
            >
              Save Changes
            </Button>
            <Button
              onClick={handleCancel}
              variant="outlined"
              color="warning"
              fullWidth
            >
              Clear & Close
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
}