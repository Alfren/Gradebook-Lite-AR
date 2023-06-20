import { Outlet } from "react-router";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Brightness6 } from "@mui/icons-material";
import AR_Flag from "../images/AR-flag.svg";
import A from "../images/A+.png";
import { Link } from "react-router-dom";
export default function TitleBar({ toggleTheme, mode }) {
  // const navigate = useNavigate();
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        p={1}
        mb={3}
        component={Paper}
      >
        <Stack direction="row">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
            }}
            title="Gradebook Lite AR - Home"
          >
            <Box component="img" src={A} height={30} sx={{ mx: 1 }} />
            <Typography variant="h5">
              Gradebook Lite{" "}
              <img
                src={AR_Flag}
                width={20}
                style={{ position: "relative", top: 3 }}
                alt="AR"
                title="Argentina (AR)"
              />
            </Typography>
          </Link>
        </Stack>
        <Stack direction="row" spacing={2}>
          {/* <Button onClick={() => navigate("/")}>Home</Button> */}
          <IconButton onClick={toggleTheme}>
            <Brightness6 />
          </IconButton>
          {/* <Button onClick={() => navigate("/login")}>Login</Button> */}
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
}
