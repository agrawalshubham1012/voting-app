import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  authSelector,
  logout,
  resetState,
} from '../auth/authSlice';
import {
  fetchVoteAsync,
  createVoteAsync,
  selectCount,
} from './voteSlice';
import styles from './Vote.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


export function Vote() {
  const count = useSelector(selectCount);
  const { isLoggedIn,isFetching, isSuccess, isError, errorMessage,user } = useSelector(
    authSelector
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    dispatch(resetState())
    dispatch(fetchVoteAsync())
  },[])

  useEffect(() => {
   
    if (isError) {
      setLoading(false);
      setError(errorMessage.toString())
    }

    if (isSuccess) {
      setOpen(false);
      setLoading(false);
      setError(null)
      setUserName('')
      setPassword('')
    }
  }, [isError, isSuccess,errorMessage,setLoading]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

const login = () => {
    if(username && password){
      setError(null)
      const data = {
        "username": username,
        "password": password
    };
    setLoading(true);
    dispatch(loginUser(data));
    }
    else{
      setError('Username / Password is required')
    }
  
  };

  return (
    <div>
      {isLoggedIn &&
      <Box sx={{position:'absolute',top:10,right:20}}>
      <Button variant={'outlined'} onClick={()=>dispatch(logout())}  color="inherit">Logout</Button>
      </Box>
      }
     
      <div className={styles.row}>
        <span className={styles.value}>{count}</span>
      </div>
      <div>
      <Button 
      onClick={()=>{
        if(isLoggedIn){
          if(user && user.user.id){
            const data = {
              userId:user?.user?.id,
              vote:1,
            }
            dispatch(createVoteAsync(data))
          }
         
        }
        else{
          handleClickOpen()
        }
        
      }}
      variant="outlined" 
      startIcon={<ThumbUpIcon />}
      >
      VOTE
      </Button>
      </div>
      <Dialog 
      open={open} 
      onClose={handleClose}
      hideBackdrop
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          {error &&
            <DialogContentText sx={{color:'red'}}>
           {error.toString()}
            </DialogContentText>
          }
          
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e)=>setUserName(e.target.value)}
            // inputProps={
            //   { readOnly: true, }
            // }
          />

          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            // inputProps={
            //   { readOnly: true, }
            // }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>login()}>Login</Button>
        </DialogActions>
      </Dialog>
      {/* <div className={[styles.rowBtn]}>
      <img src={voteUp} className={styles.votelogo} alt="logo" />
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(fetchVoteAsync(1))}
        >
          VOTE
        </button>
      </div> */}
    </div>
  );
}
