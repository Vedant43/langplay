  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'
  import { BrowserRouter } from 'react-router-dom'

  import { ThemeProvider, createTheme } from "@mui/material/styles";
  import CssBaseline from "@mui/material/CssBaseline";
  
  const theme = createTheme({
    palette: {
      customColor: {
        primary: "#616494",
        "gray-1": "#8D8E8D"
      }
    },
  });

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>,
  )
