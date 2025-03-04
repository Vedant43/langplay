  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'
  import { Provider } from 'react-redux'
  import { ThemeProvider, createTheme } from "@mui/material/styles";
  import CssBaseline from "@mui/material/CssBaseline";
import { store } from './Components/redux/store/store.js'
  
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
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </StrictMode>,
  )
