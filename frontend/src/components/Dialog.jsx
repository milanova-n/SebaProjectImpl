import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { theme } from "../theme/theme";
import CloseIcon from "@mui/icons-material/Close";

const SubscriptionDialog = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon sx={{ color: theme.colors.white }} />
      </IconButton>
      <DialogContent
        sx={{ backgroundColor: theme.colors.blue, p: "8px 30px 8px 10px" }}
      >
        <Typography
          sx={{ color: theme.colors.white, padding: "30px 8px 0px 8px" }}
        >
          Buying tickets is only <br />
          possible for subscribed <br />
          members! 🚨
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: theme.colors.blue,
          paddingLeft: 1,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          sx={{
            backgroundColor: theme.colors.white,
            "&:hover": {
              backgroundColor: theme.colors.white,
            },
          }}
        >
          <Link
            to={"/subscribe"}
            style={{ textDecoration: "none", color: theme.colors.blue }}
          >
            Subscribe now!
          </Link>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SubscriptionDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default SubscriptionDialog;
